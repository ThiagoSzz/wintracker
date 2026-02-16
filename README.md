# wintracker

A mobile-first web application for tracking wins and losses in competitive matches between friends. Built entirely as a vibe-coded project.

## Description

Wintracker allows users to maintain records of their competitive match results against various opponents. Users can create accounts, add opponents, and track their win/loss statistics over time. The application supports editing match history, managing opponent lists, and provides a clean interface for viewing performance data.

<img width="243" height="528" alt="image" src="https://github.com/user-attachments/assets/4a3a3704-911a-485d-b0d3-b37e6aeaa363" />
<img width="243" height="528" alt="image" src="https://github.com/user-attachments/assets/5262628e-90a7-43ae-acb3-200dea75f514" />
<img width="243" height="528" alt="image" src="https://github.com/user-attachments/assets/9c733af5-2b9f-4f5f-ba48-4d76f4a3572e" />
<img width="243" height="528" alt="image" src="https://github.com/user-attachments/assets/c73aa5fe-5f6d-4c1a-bde1-cac28ac292e1" />

### Main Workflows

1. **User Registration/Login**: Enter name to create new account or access existing account
2. **Opponent Management**: Add new opponents to track matches against
3. **Match Tracking**: Record wins and losses for each opponent
4. **Data Management**: Edit match results, update opponent names, delete records
5. **History Viewing**: Review complete match history and statistics

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge&logo=mantine&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B35?style=for-the-badge&logo=zustand&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)

## Architecture Overview

### Frontend Architecture

- **Component Structure**: React functional components with TypeScript interfaces
- **State Management**: 
  - Global user state managed by Zustand store
  - Server state managed by TanStack Query for caching and synchronization
- **Data Flow**: Unidirectional data flow with custom hooks for database operations
- **UI Components**: Mantine component library with custom styling
- **Internationalization**: i18next for multi-language support
- **Routing**: URL-based user persistence without traditional routing

### Database Architecture

- **Database**: PostgreSQL hosted on Neon (serverless)
- **Tables**: 
  - `users`: User accounts with unique names
  - `matches`: Win/loss records linked to users and opponents
- **Relationships**: Foreign key constraints between users and matches
- **Indexes**: Optimized queries with indexes on user_id and opponent names
- **Data Integrity**: Unique constraints and check constraints for data validation

### Data Layer

- **Connection Management**: Singleton pattern for database initialization
- **Query Abstraction**: Dedicated query modules for users and matches
- **Type Safety**: TypeScript interfaces for all data structures
- **Error Handling**: Comprehensive error management with user feedback
- **Validation**: Input sanitization and validation utilities


## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local` (see `.env.template` for reference)
4. Run development server: `npm run dev`