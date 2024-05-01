# Thoughts on Choosing a Typescript ORM to use

## April 30, 2024

I (Alex) did 30 minutes of typescript ORM research since that's gonna be something we both use and I wanna be informed. Right now it's between Drizzle & Prisma. They both seem like good choices, it's just more about if we want a closer-to-SQL abstraction with Drizzle, or a higher level one with Prisma. All of the concerns I have with an ORM seem to be handled by both, in particular:

- Migration support (they both work the same by generatin .sql files that then get run in succession)
- Good Typescript support
- Efficient
- easy to setup and get working

I slightly prefer Prisma's non-typescript schema file declaration over Drizzle, but I saw mention that you need to define the schema all in one file which might be a problem with our monorepo architecture, so that's a negative for Prisma. I also prefer being closer to SQL because that lets us deepen our SQL at the same time which will be beneficial for the rest of our career.

I'm 60-40 in favor or Drizzle. What do you think Will?
