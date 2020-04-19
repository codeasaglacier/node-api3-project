const express = require("express")
const welcomeRouter = require("./users/welcome-router")
const userRouter = require("./users/userRouter")
const postsRouter = require( "./posts/postRouter" )
//1) install and import express, cors, and morgan
const cors = require( "cors" )
const morgan = require( 'morgan' )
const logger = require( "./logger" )

const server = express()
const port = 4000

server.use(express.json())
//2)call cors and morgan with server.use
server.use( cors() )
server.use( morgan( "combined" ) )
server.use( logger( { format: "long" } ) )

server.use( "/", welcomeRouter )
server.use( "/users", userRouter )
server.use( "/posts", postsRouter )

server.use( ( req, res ) => {
	res.status( 404 ).json( {
		message: "Route was not found"
	} )
} )

server.use( ( err, req, res, next ) => {
	console.log( err )
	res.status( 500 ).json( {
		message: "Something went wrong"
	} )
} )

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
