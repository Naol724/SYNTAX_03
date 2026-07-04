# API Reference

This document provides a comprehensive reference for all API endpoints in the Syntax Software Solutions website.

## Authentication

Most admin endpoints require authentication via NextAuth.js. Include the session cookie in requests.

### Public Endpoints

These endpoints can be accessed without authentication.

### Admin Endpoints

These endpoints require admin authentication. Include the session cookie from `/api/auth/[...nextauth]`.

---

## Public API Routes

### Services

#### GET /api/public/services

Get all active services.

**Query Parameters:**
- `category` (optional) - Filter by category

**Response:**
```json
{
  "services": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "price": "string",
      "category": "string",
      "active": true,
      "featured": false,
      "order": 0
    }
  ]
}
```

### Testimonials

#### GET /api/public/testimonials

Get all active testimonials.

**Query Parameters:**
- `featured` (optional) - Filter by featured status ("true"/"false")
- `limit` (optional) - Maximum number of results (default: 10)

**Response:**
```json
{
  "testimonials": [
    {
      "_id": "string",
      "name": "string",
      "company": "string",
      "content": "string",
      "rating": 5,
      "image": "string",
      "active": true,
      "featured": false,
      "order": 0
    }
  ]
}
```

### Portfolio

#### GET /api/public/portfolio

Get all active portfolio projects.

**Query Parameters:**
- `category` (optional) - Filter by category
- `featured` (optional) - Filter by featured status ("true"/"false")
- `limit` (optional) - Maximum number of results (default: 10)

**Response:**
```json
{
  "projects": [
    {
      "_id": "string",
      "title": "string",
      "slug": "string",
      "description": "string",
      "category": "string",
      "images": ["string"],
      "thumbnail": "string",
      "client": "string",
      "technologies": ["string"],
      "projectUrl": "string",
      "githubUrl": "string",
      "featured": false,
      "active": true,
      "order": 0
    }
  ]
}
```

### Blog

#### GET /api/public/blog

Get all published blog posts.

**Query Parameters:**
- `category` (optional) - Filter by category
- `featured` (optional) - Filter by featured status ("true"/"false")
- `search` (optional) - Search in title and excerpt
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10)

**Response:**
```json
{
  "posts": [
    {
      "_id": "string",
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "content": "string",
      "featuredImage": "string",
      "category": "string",
      "tags": ["string"],
      "author": "string",
      "published": true,
      "featured": false,
      "views": 0,
      "createdAt": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET /api/public/blog/[slug]

Get a single blog post by slug.

**Response:**
```json
{
  "post": {
    "_id": "string",
    "title": "string",
    "slug": "string",
    "excerpt": "string",
    "content": "string",
    "featuredImage": "string",
    "category": "string",
    "tags": ["string"],
    "author": "string",
    "published": true,
    "featured": false,
    "views": 0
  },
  "relatedPosts": [...],
  "comments": [...]
}
```

### Team

#### GET /api/public/team

Get all active team members.

**Response:**
```json
{
  "teamMembers": [
    {
      "_id": "string",
      "name": "string",
      "role": "string",
      "bio": "string",
      "image": "string",
      "linkedin": "string",
      "github": "string",
      "twitter": "string",
      "active": true,
      "order": 0
    }
  ]
}
```

### FAQ

#### GET /api/public/faq

Get all active FAQs.

**Query Parameters:**
- `category` (optional) - Filter by category

**Response:**
```json
{
  "faqs": [
    {
      "_id": "string",
      "question": "string",
      "answer": "string",
      "category": "string",
      "order": 0,
      "active": true
    }
  ]
}
```

### Newsletter

#### POST /api/newsletter

Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed"
}
```

### AI Chat

#### POST /api/ai/chat

Send message to AI chatbot.

**Request Body:**
```json
{
  "message": "string",
  "history": [
    {
      "role": "user",
      "content": "string"
    }
  ]
}
```

**Response:**
```json
{
  "message": "AI response here"
}
```

---

## Admin API Routes

### Authentication

#### POST /api/auth/[...nextauth]

NextAuth.js authentication handler.

### Bookings

#### GET /api/bookings

Get all bookings (admin only).

**Query Parameters:**
- `status` (optional) - Filter by status
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10)

**Response:**
```json
{
  "bookings": [...],
  "pagination": {...}
}
```

#### POST /api/bookings

Create new booking (public).

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "service": "string",
  "preferredDate": "string",
  "preferredTime": "string",
  "message": "string"
}
```

#### PATCH /api/bookings/[id]

Update booking (admin only).

#### DELETE /api/bookings/[id]

Delete booking (admin only).

### Leads

#### GET /api/leads

Get all leads (admin only).

**Query Parameters:**
- `status` (optional) - Filter by status
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10)

**Response:**
```json
{
  "leads": [...],
  "pagination": {...}
}
```

#### POST /api/leads

Create new lead (public).

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "interest": "string",
  "source": "string",
  "message": "string"
}
```

#### PATCH /api/leads/[id]

Update lead (admin only).

#### DELETE /api/leads/[id]

Delete lead (admin only).

### Blog Posts

#### GET /api/blog

Get all blog posts (admin only).

**Query Parameters:**
- `published` (optional) - Filter by published status
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10)

#### POST /api/blog

Create new blog post (admin only).

#### PATCH /api/blog/[id]

Update blog post (admin only).

#### DELETE /api/blog/[id]

Delete blog post (admin only).

### Services

#### GET /api/services

Get all services (admin only).

#### POST /api/services

Create new service (admin only).

#### PATCH /api/services/[id]

Update service (admin only).

#### DELETE /api/services/[id]

Delete service (admin only).

### Testimonials

#### GET /api/testimonials

Get all testimonials (admin only).

#### POST /api/testimonials

Create new testimonial (admin only).

#### PATCH /api/testimonials/[id]

Update testimonial (admin only).

#### DELETE /api/testimonials/[id]

Delete testimonial (admin only).

### Portfolio

#### GET /api/portfolio

Get all portfolio projects (admin only).

#### POST /api/portfolio

Create new portfolio project (admin only).

#### PATCH /api/portfolio/[id]

Update portfolio project (admin only).

#### DELETE /api/portfolio/[id]

Delete portfolio project (admin only).

### Gallery

#### GET /api/gallery

Get all gallery items (admin only).

#### POST /api/gallery

Create new gallery item (admin only).

#### PATCH /api/gallery/[id]

Update gallery item (admin only).

#### DELETE /api/gallery/[id]

Delete gallery item (admin only).

### Content (CMS)

#### GET /api/content

Get all content items (admin only).

**Query Parameters:**
- `section` (optional) - Filter by section

#### POST /api/content

Create new content item (admin only).

#### PATCH /api/content/[id]

Update content item (admin only).

#### DELETE /api/content/[id]

Delete content item (admin only).

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message here"
}
```

**Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS

API routes follow Next.js default CORS settings. Configure custom CORS in `next.config.mjs` if needed.
