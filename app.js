const express = require( "express" );
const bodyParser = require( "body-parser" );
const https = require( "https" );
const client = require( "@mailchimp/mailchimp_marketing" );
const { response } = require( "express" );

const app = express();
const port = 3000;

app.use( express.static( "public" ) ); // put static doc work: css and images in public folder
app.use( bodyParser.urlencoded( { extended: true } ) );

client.setConfig( { apiKey: "46481dd7da7e90caf7b932bc4f094395-us21", server: "us21" } );

app.get( "/", ( req, res ) =>
{
    res.sendFile( __dirname + "/signup.html" );
} );

app.post( "/", ( req, res ) =>
{
    const ftName = req.body.fName; //req.body.name!!!
    const ltName = req.body.lName;
    const email = req.body.email;
    // console.log( ftName, ltName, email );

    //mailchimp: add list member
    const subscribingUser = { firstName: ftName, lastName: ltName, email: email };
    const run = async () =>
    {
        const response = await client.lists.addListMember( "c9ce81e721", {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        } );
        console.log( response );
    };

    run();

    //see the result successful or not
    if ( response.statusCode === 200 )
    {
        res.sendFile( __dirname + "/success.html" );
    } else
    {
        res.sendFile( __dirname + "/failure.html" );
    }
} );

app.post( "/failure", ( req, res ) =>
{
    res.redirect( "/" );
} );

app.listen( port, () =>
{
    console.log( "listening" );
} );
