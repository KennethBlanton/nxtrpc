import express from "express"
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from "cors";
import { z } from "zod";
import  { Client } from 'pg'
import { PrismaClient } from '@prisma/client'

interface User {
  user_id?: number,    
  password: string,   
  email: string,
  created_on: Date, 
  last_login?: Date 
}


const prisma = new PrismaClient()

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected")
});

const getUsers = (req?: any) => {
  const users = prisma.users.findMany({
    orderBy: {
      user_id: "desc"
    }
  })
  return users
}

const login = (email?: string) => {
  const user = prisma.users.findUnique({
    where: {
      email: email
    }
  })
  .then(user => user);
  return user
}


const createUser = async (req: {password:string, email:string}) => {
  const data: User = {
    email: req.email,
    password: req.password,
    created_on: new Date()
  }
  const uniqueEmail = await login(data.email)

  if(uniqueEmail) return false;

  const user = await prisma.users.create({
    data: {
      ...data,    
    }
  })

  return data
}
const removeUser = async (id : number) => {
  const user = await prisma.users.delete({
    where: {
      user_id: id
    }
  })
}

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  createUser: t.procedure
    .input(z.object({ email: z.string().min(4), password:z.string().min(8) }))
    .mutation(async (req) => {
      const data = await createUser(req.input);
      return data
    }),
  removeUser: t.procedure.input(z.number()).mutation(async (req) => {
      removeUser(req.input)
      return true
    }),
  login: t.procedure
    .input(z.object({ email: z.string().min(4), password:z.string().min(8)}))
    .query(async (req) => {
      const user =  await login(req.input.email);
      if(user && user.password === req.input.password) {
        return user
      }
    }),
  getAllUsers: t.procedure.query((req) => {
      return getUsers();
    }),
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
app.listen(8080);