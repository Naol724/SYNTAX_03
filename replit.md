# Overview

This is an AI-powered creative assistant application called "Nile" that helps users with various creative tasks including website editing, video editing, graphics design, and general creative assistance. The application features a chat-based interface where users can interact with specialized AI assistants for different creative domains, upload files for analysis, and receive practical code solutions and creative guidance.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Theme Support**: Light/dark mode toggle with persistent theme storage

## Backend Architecture
- **Runtime**: Node.js with Express.js as the web server
- **Development**: tsx for TypeScript execution in development
- **File Uploads**: Multer middleware for handling file uploads with size and type restrictions
- **Storage Pattern**: Abstracted storage interface with in-memory implementation for development
- **API Design**: RESTful endpoints for conversations, messages, and file operations

## Data Management
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema**: Well-defined tables for users, conversations, messages, and uploaded files
- **Validation**: Zod schemas for runtime type validation
- **Session Management**: Stateless approach using guest user pattern

## AI Integration
- **Provider**: OpenAI GPT-4o for chat completions
- **Categorization**: Specialized system prompts for different creative domains (website, video, graphics, general)
- **File Analysis**: AI-powered analysis of uploaded files including images, videos, and code
- **Response Processing**: Structured response handling with code block extraction and suggestions

## File Handling
- **Upload Support**: Multiple file types including images, videos, and code files
- **Size Limits**: 10MB maximum file size
- **Storage**: Local filesystem storage with unique filename generation
- **Security**: MIME type validation and file extension filtering

## Development Features
- **Hot Reload**: Vite development server with HMR
- **Error Handling**: Runtime error overlay for development
- **Logging**: Request/response logging with performance metrics
- **Code Quality**: TypeScript strict mode with comprehensive type checking