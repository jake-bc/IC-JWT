const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const request = require("request");
const Post = require('../../models/Post')

const Profile = require("../../models/Profile");


const validatePostInput = require('../../validation/post')


// @route       GET /api/posts/tests
// @desc        Tests post route
// @access      Public
router.get('/test', (req, res) => res.json({ msg: "Posts Works" })
);


router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404));
});

// @route       POST /api/posts
// @desc        Create Post
// @access      private

router.post('/', passport.authenticate("jwt", { session: false }),
    (req, res) => {

    //validation
    const { errors, isValid } = validatePostInput(req.body);
        
    //check validation
    if(!isValid) {
       return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route       GET /api/posts/:id
// @desc        Get Posts By Id
// @access      Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No Post Found With ID' })
        );
});

// @route       DELETE /api/posts/:id
// @desc        DELETE Posts By Id
// @access      Public
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
        if(post.user.toString() !== req.user.id) {
            return res.status(404).json({ notauthorized: 'User not authorized!' });
        }

        //Delete
        post.remove().then(() => res.json({ success: true }))
    })
    .catch(err => res.status(404).json({ postnotnotfound: 'No post found' }))
  })
});

// post api/posts/like/:id

router.post(
    "/like/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0
                    ){
                          return res.status(400).json({ alreadyliked: 'User already like this post' });
                    }

                    //add user id to likes array
                    post.likes.unshift({ user: req.user.id })

                    post.save().then(post => res.json(post))
            })
                    .catch(err => res.status(404).json({ postnotnotfound: 'No post found' }))
    });
});


// post api/posts/unlike/:id

router.post(
    "/unlike/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0
                        ) {
                            return res.status(400).json({ notliked: 'You must like this post before unliking this post' });
                        }
                        //add user id to likes array
                        const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                        //splice out of array
                        post.likes.splice(removeIndex, 1);

                        //save
                        post.save().then(post => res.json(post))
                    })
                    .catch(err => res.status(404).json({ postnotnotfound: 'No post found' }))
            });
    });


module.exports = router;