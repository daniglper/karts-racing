import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Pilot } from "../models/Pilot";

// interface Post {
//   userId: Number;
//   id: Number;
//   title: String;
//   body: String;
// }

// // getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//   // get some posts
//   let result: AxiosResponse = await axios.get(
//     `https://jsonplaceholder.typicode.com/posts`
//   );
//   let posts: [Post] = result.data;
//   return res.status(200).json({
//     message: posts,
//   });
// };

// // getting a single post
// const getPost = async (req: Request, res: Response, next: NextFunction) => {
//   // get the post id from the req
//   let id: string = req.params.id;
//   // get the post
//   let result: AxiosResponse = await axios.get(
//     `https://jsonplaceholder.typicode.com/posts/${id}`
//   );
//   let post: Post = result.data;
//   return res.status(200).json({
//     message: post,
//   });
// };

// // updating a post
// const updatePost = async (req: Request, res: Response, next: NextFunction) => {
//   // get the post id from the req.params
//   let id: string = req.params.id;
//   // get the data from req.body
//   let title: string = req.body.title ?? null;
//   let body: string = req.body.body ?? null;
//   // update the post
//   let response: AxiosResponse = await axios.put(
//     `https://jsonplaceholder.typicode.com/posts/${id}`,
//     {
//       ...(title && { title }),
//       ...(body && { body }),
//     }
//   );
//   // return response
//   return res.status(200).json({
//     message: response.data,
//   });
// };

// const addPost = async (req: Request, res: Response, next: NextFunction) => {
//   // get the data from req.body
//   let title: string = req.body.title;
//   let body: string = req.body.body;
//   // add the post
//   let response: AxiosResponse = await axios.post(
//     `https://jsonplaceholder.typicode.com/posts`,
//     {
//       title,
//       body,
//     }
//   );
//   // return response
//   return res.status(200).json({
//     message: response.data,
//   });
// };

const addPilot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate new random _id
    const _id = await generateRandomPilotId();

    // add pilot
    let newPilot = new Pilot({ _id, ...req.body });
    newPilot = await Pilot.create(newPilot);

    // return
    return res.status(200).json(newPilot);
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

const getAllPilots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get all pilots
  const pilots = await Pilot.find();

  // return
  return res.status(200).json(pilots);
};

async function generateRandomPilotId(): Promise<string> {
  // TODO: Improvable, but will do for now
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let existingId = true;
  let id: string = "";

  // loop if the id already exists
  while (existingId) {
    id = "";
    for (let i = 0; i < 24; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    existingId = await Pilot.exists({ _id: id });
  }

  return id;
}

export default {
  getAllPilots,
  addPilot,
};
