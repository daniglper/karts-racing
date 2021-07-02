import express from 'express';
import controller from '../controllers/pilot-controller';
const router = express.Router();

router.get('/getAllPilots', controller.getAllPilots);
router.post('/addPilot', controller.addPilot);

// router.get('/posts', controller.getPosts);
// router.get('/posts/:id', controller.getPost);
// router.put('/posts/:id', controller.updatePost);
// router.post('/posts', controller.addPost);

export = router;