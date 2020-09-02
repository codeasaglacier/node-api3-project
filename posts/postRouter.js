const express = require('express');
const usersDB = require("../users/userDb");
const postDB = require("./postDb");
const router = express.Router();

router.get('/', (req, res) => {
  postDB.get()
    .then( ( posts ) => {
      res.status( 200 ).json( posts )
    } )
    .catch( ( err ) => {
      next( err )
    } )
});

router.get('/:id', validatePostId(), (req, res) => {
  res.status( 200 ).json( req.post )
});

router.delete('/:id', validatePostId(), (req, res) => {
  postDB.remove( req.params.id )
  .then((count) => {
    if (count > 0) {
      res.status(200).json({
        message: `Post ${ req.params.id } has been delorted`,
      })
    } else {
      res.status(404).json({
        message: "The user could not be found",
      })
    }
  })
  .catch(( err ) => {
    next( err )
  })
});

router.put('/:id', validatePostId(), (req, res, next ) => {
  postDB.update(req.params.id, req.body)
  .then((post) => {
      res.status(200).json(post)
  })
  .catch(( err ) => {
    next( err )
  })
});

// custom middleware

function validatePostId() {
  return ( req, res, next ) => {
    console.log( req.params.id )
		postDB.getById( req.params.id )
			.then( ( post ) => {
				if ( post ) {
					req.post = post
					next()
				} else {
					res.status( 400 ).json( {
						message: "User not found"
					} )
				}
			} )
			.catch( ( err ) => next( err ) )
	}
}

module.exports = router;
