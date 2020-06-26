import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async ( req, res ) => {
      // get url to retrieve image from
      const image_url = req.query.image_url;

      // check if url is present
      if(!image_url) {
          res.status(400).send({message: 'No image url provided'});
      }

      // handle exceptions to respond in a clean state
      try {
          // filter the image
          const filtered = await filterImageFromURL(image_url);

          // send the image as response
          let local_paths: string[] = [];

          res.sendFile(filtered, (err) => {
              local_paths.push(filtered);

              if(err) {
                  console.log(err);
              }

              // ensure to remove all local files
              deleteLocalFiles(local_paths);
          });

      } catch (error) {
          res.status(422).send({message: "Provided URL immage cannot be processed"});
      }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
