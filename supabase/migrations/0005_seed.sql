-- Migration 0005: Seed placeholder content (optional but recommended)
-- Gives the public site real-looking data to render immediately.
-- Replace with your own content via the admin dashboard later.

-- Singleton site content
insert into public.site_content (
  singleton, owner_name, tagline, service_statement, about_text,
  process_strategy, process_design, process_development, process_launch,
  contact_email
)
values (
  true,
  'Studio Name',
  'Websites that mean business',
  'I design and build premium websites for modern businesses — editorial, fast, and built to convert.',
  'I''m an independent designer and developer partnering with businesses to craft websites that feel considered end to end. Every project is treated as a product: strategy first, design that earns attention, and engineering that holds up.',
  'We start by understanding your business, audience, and goals — mapping the story the site needs to tell before a single pixel is placed.',
  'Editorial, typography-led design with generous whitespace and large visuals. Every screen is designed to feel premium and intentional.',
  'Clean, performant builds with responsive layouts, accessibility, and subtle motion — engineered to load fast and last.',
  'A smooth launch with the details handled: performance checks, cross-device testing, and a handover you can build on.',
  'hello@example.com'
)
on conflict (singleton) do nothing;

-- Website types
insert into public.website_types (name, description, sort_order) values
  ('Marketing & Brand Sites', 'Editorial sites that position a business with clarity and confidence.', 1),
  ('E-commerce', 'Considered storefronts that make browsing and buying feel effortless.', 2),
  ('Landing Pages', 'Focused, high-converting pages built around a single clear goal.', 3),
  ('Web Apps & Dashboards', 'Interfaces for products and internal tools that stay usable at scale.', 4)
on conflict do nothing;

-- Sample projects
insert into public.projects (
  slug, client_name, industry, short_description,
  preview_image_url, preview_image_alt, live_site_link, long_description, sort_order
) values
  (
    'northwind-coffee',
    'Northwind Coffee',
    'Hospitality',
    'A warm, editorial site for a specialty coffee roaster, built around big imagery and a calm reading rhythm.',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&q=80',
    'Northwind Coffee website shown on a laptop with a warm hero image',
    'https://example.com',
    'Northwind wanted a site that felt as considered as their roast. We led with full-bleed imagery, a restrained type system, and a shop that stays out of the way of the product.',
    1
  ),
  (
    'atlas-architecture',
    'Atlas Architecture',
    'Architecture',
    'A minimal portfolio for an architecture studio, letting large project photography carry the page.',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80',
    'Atlas Architecture portfolio homepage with a large building photograph',
    'https://example.com',
    'For Atlas we designed a near-invisible interface: whitespace, quiet navigation, and generous project galleries that place the work first.',
    2
  ),
  (
    'verdant-skincare',
    'Verdant Skincare',
    'E-commerce',
    'A clean, conversion-focused storefront for a natural skincare brand.',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1600&q=80',
    'Verdant Skincare product page with soft neutral tones',
    'https://example.com',
    'Verdant needed an e-commerce experience that felt premium without clutter. We built a fast storefront with editorial product storytelling and a frictionless checkout.',
    3
  )
on conflict (slug) do nothing;

-- A testimonial tied to the first project
insert into public.testimonials (project_id, quote, author_name, role)
select id,
  'They understood our brand better than we did. The site does the selling for us now.',
  'Maya Chen', 'Founder, Northwind Coffee'
from public.projects where slug = 'northwind-coffee'
on conflict (project_id) do nothing;
