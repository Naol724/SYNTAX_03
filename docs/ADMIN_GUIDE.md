# Admin Guide

This guide covers how to use the admin panel for Syntax Software Solutions website.

## Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You will be redirected to the dashboard

## Dashboard

The dashboard provides an overview of:
- Total bookings
- Total leads
- Blog post views
- Recent activity

## Managing Bookings

Navigate to `/admin/bookings` to manage service booking requests.

### Actions
- **Confirm**: Mark a booking as confirmed
- **Cancel**: Cancel a booking
- **View Details**: See full booking information

### Status
- `pending` - New booking awaiting confirmation
- `confirmed` - Booking has been confirmed
- `completed` - Service has been delivered
- `cancelled` - Booking was cancelled

## Managing Leads

Navigate to `/admin/leads` to manage potential customer leads.

### Actions
- **Update Status**: Change lead status
- **Add Notes**: Add notes about the lead
- **Delete**: Remove a lead

### Status
- `new` - New lead
- `contacted` - Initial contact made
- `qualified` - Qualified as potential customer
- `converted` - Converted to paying customer
- `lost` - Lead was lost

## Managing Blog Posts

Navigate to `/admin/blog` to manage blog content.

### Actions
- **Create**: Add new blog post
- **Edit**: Modify existing post
- **Publish/Unpublish**: Toggle visibility
- **Feature**: Mark as featured post
- **Delete**: Remove post

### Post Fields
- Title
- Slug (URL-friendly identifier)
- Excerpt
- Content (HTML)
- Featured Image
- Category
- Tags
- Author
- Published (boolean)
- Featured (boolean)

## Managing Services

Navigate to `/admin/services` to manage service offerings.

### Actions
- **Create**: Add new service
- **Edit**: Modify service details
- **Toggle Active**: Show/hide service
- **Feature**: Mark as featured service
- **Delete**: Remove service

### Service Fields
- Name
- Description
- Icon (emoji or icon name)
- Price
- Category
- Active (boolean)
- Featured (boolean)
- Order (display order)

## Managing Testimonials

Navigate to `/admin/testimonials` to manage customer testimonials.

### Actions
- **Create**: Add new testimonial
- **Edit**: Modify testimonial
- **Toggle Active**: Show/hide testimonial
- **Feature**: Mark as featured
- **Delete**: Remove testimonial

### Testimonial Fields
- Name
- Company
- Content
- Rating (1-5)
- Image URL
- Active (boolean)
- Featured (boolean)
- Order

## Managing Portfolio

Navigate to `/admin/portfolio` to manage portfolio projects.

### Actions
- **Create**: Add new project
- **Edit**: Modify project details
- **Toggle Active**: Show/hide project
- **Feature**: Mark as featured project
- **Delete**: Remove project

### Project Fields
- Title
- Slug
- Description
- Category
- Images (array of URLs)
- Thumbnail
- Client name
- Technologies (array)
- Project URL
- GitHub URL
- Featured (boolean)
- Active (boolean)
- Order

## Managing Gallery

Navigate to `/admin/gallery` to manage image gallery.

### Actions
- **Upload**: Add new image
- **Edit**: Modify image details
- **Toggle Active**: Show/hide image
- **Delete**: Remove image

### Gallery Item Fields
- Title
- Description
- Image URL
- Category
- Active (boolean)
- Order

## Content Management (CMS)

Navigate to `/admin/content` to manage website content.

### Sections
- Hero
- About
- Services
- Contact
- Footer

### Content Types
- Text
- Textarea
- Number
- Boolean

## Analytics

Navigate to `/admin/analytics` to view website performance metrics.

### Metrics
- Total page views
- Unique visitors
- Bookings
- Leads
- Blog views
- Daily traffic trends

## Security

- Always log out when done
- Use strong passwords
- Keep credentials secure
- Regularly update admin password

## Email Notifications

The system automatically sends email notifications for:
- New bookings
- New leads
- New blog comments

Ensure email credentials are configured in `.env.local`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@syntaxsoftwaresolution.com
```
