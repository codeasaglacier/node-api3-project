const express = require('express');
const usersDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  usersDB.insert( req.body )
    .then( ( user ) => {
      res.status( 201 ).json( user )
    } )
    .catch( ( err ) => {
      next( err )
    } )
});

router.post('/:id/posts', validatePost(), validateUserId(), (req, res,next) => {
  console.log( req.body )
    postDB.insert( req.body )
    .then((post) => {
			res.status(201).json(post)
		})
		.catch(( err ) => {
			next( err )
		})
});

router.get('/', ( req, res, next ) => {
  usersDB.get()
    .then( ( users ) => {
      res.status( 200 ).json( users )
    } )
    .catch( ( err ) => {
      next( ( err ) )
    } )
});

router.get("/:id", validateUserId(), (req, res) => {
  res.status(200).json( req.user )
    // .then( ( posts ) )
})

router.get('/:id/posts', validateUserId(), (req, res) => {
  usersDB.getUserPosts( req.params.id )
    .then( ( posts ) => {
      res.status( 200 ).json( posts )
    } )
    .catch( ( err ) => {
      next( err )
    } )
});

router.delete('/:id', validateUserId(), (req, res) => {
	usersDB.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The user has been nuked",
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

router.put('/:id', validateUserId(), (req, res) => {
  usersDB.update(req.params.id, req.body)
  .then((user) => {
      res.status(200).json(user)
  })
  .catch(( err ) => {
    next( err )
  })
});

//custom middleware

function validateUserId() {
  return ( req, res, next ) => {
		usersDB.getById( req.params.id )
			.then( ( user ) => {
				if ( user ) {
					req.user = user
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

function validateUser() {
  return (  req, res, next ) => {
    if ( !req.body ) {
      return res.status( 400 ).json( {
        message: "Missing post body"
      } )
    } else if (!req.body.name ) {
			return res.status(400).json({
				message: "Missing user name",
			})
		}
		next()
    }
}


function validatePost() {
	return (  req, res, next ) => {
		if (!req.body || !req.body.text) {
			return res.status(400).json({
				message: "Missing text",
			})
		}
		next()
	}
}

module.exports = router;
