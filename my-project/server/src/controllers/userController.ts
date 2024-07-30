import { Request, Response } from 'express';
import { loadUsers, saveUsers } from '../utils/fileUtils';
import { User } from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  const users = loadUsers();
  res.json(users);
};

export const postUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const newUser: User = {
    id: Date.now(),
    username,
    password
  };

  const users = loadUsers();
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'User saved' });
};
