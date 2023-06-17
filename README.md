# Multi Authentication with Jwt Passport in NestJS

This repository provides an example implementation of multiple authentication from two separate table (user & staff) using Jwt Passport in a NestJS application. It demonstrates how to protect routes and retrieve the authenticated user and staff from the database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Prerequisites

Before getting started, ensure that you have the following prerequisites:

- Node.js (version 14 or above)
- npm or yarn package manager
- [NestJS](https://nestjs.com/) (installed globally or as a project dependency)
- A database (e.g., PostgreSQL, MySQL, MongoDB) supported by your NestJS application
- Prisma client set up and connected to your database

## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/SujoySust/Multi-Auth-with-Jwt-Passport-in-NestJS.git
```

2. Navigate to the project directory:
```bash
cd nestjs-simple-auth-restapi
```
3. Install the dependencies:
```bash
npm install or yarn install
```
4. Configure your database connection by updating the configuration file: prisma/schema.prisma

5. Run the database migrations to create the necessary tables:
```bash
npm prisma db push or yarn prisma db push
```
## Usage

To use the authentication setup provided by JwtAuthGuard, follow these steps:

For User Gaurd: Include the JwtAuthGuard() in your route or controller using the @UseGuards() decorator:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../../models/db/user.model';
import { UserEntity } from '../../../libs/decorators/user.decorator';
import { JwtAuthGuard } from '../../../libs/auth/auth.gaurd';

@UseGuards(JwtAuthGuard())
@Controller()
export class UserController {
  @Get('/profile')
  async profile(@UserEntity() user: User): Promise<User> {
    return user;
  }
}
```
For Staff Gaurd: Include the JwtAuthGuard('staff') in your route or controller using the @UseGuards() decorator:
```typescript
@UseGuards(JwtAuthGuard('staff'))
@Controller('staff')
export class StaffController {
  @Get('/profile')
  async profile(@UserEntity() staff: Staff): Promise<Staff> {
    return staff;
  }
}
```

## Configuration

To configure the authentication setup, you may need to modify the following files:

config/jwt.config.ts: Adjust the JWT secret, expiration time, and other configurations to suit your needs.

Make sure to review and modify the configurations according to your specific application requirements.
