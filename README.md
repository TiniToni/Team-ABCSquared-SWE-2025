# ChefTamer
### Team ABC-Squared

## Learn to Cook, Grow Your Animal

**ChefTamer** is a web application designed to teach cooking skills interactively. Users progress through **units** that introduce new cooking techniques, and their progress is tracked through a **cozy, customizable mascot**. Completing lessons unlocks new mascots, allowing users to grow and personalize their character as they advance.

## Features

- **Interactive Units:** Lessons are divided into units that teach new skills step by step.  
- **Progress Tracking:** Users unlock new mascots and achievements as they complete units.  
- **Mascot System:** Unique to ChefTamer, mascots grow with the user and can be customized for a personal, engaging experience.  
- **Safety Tips & Guidance:** Each lesson includes key safety tips to ensure safe cooking practices.

## Tech Stack

- **Backend:** Django, Django REST Framework  
- **Authentication:** JWT via `djangorestframework-simplejwt`  
- **Database:** PostgreSQL (`psycopg2-binary`)  
- **Other:** CORS support (`django-cors-headers`), environment variable management (`python-dotenv`)  

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cheftamer.git
   cd cheftamer
