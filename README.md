# SDP-Project
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/NotJordanZA/SDP-Project/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/NotJordanZA/SDP-Project/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/NotJordanZA/SDP-Project/badge.svg?branch=main)](https://coveralls.io/github/NotJordanZA/SDP-Project?branch=main)

https://wits-infrastructure-management.web.app/

# Wits Venue Management System

## Overview

This repository contains the code for the **Venue Management System** website for the **University of the Witwatersrand**. The goal of this web application is to streamline the process of managing classroom and venue assignments, bookings, and maintenance, thereby enhancing the efficiency of space utilization on campus.

The system is designed to serve two distinct roles: **Admins** and **Users** (Lecturers and Students). Each role has its own dedicated flow to provide the appropriate tools and features for their needs.

## Features

### Admin Flow
Admins have full control over the venue management system and can perform the following actions:

- **Manage Venues**:
    - Add new venues to the system.
    - Edit existing venue information.
    - Remove venues when no longer required.
    - Add academic schedules to venues, ensuring that venues are unavailable for booking during lectures.

- **Make Bookings**:
    - Book any type of venue (lecture halls, labs, study rooms, etc.) on behalf of other users.
    - Prevent scheduling conflicts with academic schedules.

- **Manage Bookings**:
    - Edit or cancel existing bookings made by any user.

- **Manage Reports**:
    - Monitor and track the progress of reports submitted by users (regarding venue issues).
    - Provide feedback and mark reports as resolved.

- **Manage Requests**:
    - View and handle requests submitted by users.
    - Approve or deny requests, such as venue booking permission for restricted venues.

### User Flow
There are two types of users in the system: **Students** and **Lecturers**. While their flows are similar, they have different permissions regarding venue booking.

#### Student Flow:
- Can only book **Study Rooms** and **Tutorial Rooms**.
- Users can:
    - Search for available venues and make bookings.
    - Edit or delete their own bookings.
    - File reports about venue issues (e.g., broken equipment).
    - Submit requests to admins if they need special permissions (e.g., access to restricted venues).
    - View notifications regarding booking changes, request status, and report updates.

#### Lecturer Flow:
- Can book **Study Rooms, Tutorial Rooms, Lecture Venues, Labs**, and **Test Venues**.
- Same functionality as students with an extended venue booking range.

### Notifications
Both Students and Lecturers can receive notifications for:
- Status updates on reports and requests.
- Changes made by admins to their bookings.
- New bookings made by admins on their behalf.

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/NotJordanZA/SDP-Project.git
    ```
2. Navigate into the project directory:
    ```bash
    cd SDP-Project
    ```
3. Navigate into the client directory:
    ```bash
    cd client
    ```

4. Install required dependencies:
    ```bash
    npm install
    ```

5. Navigate into the server directory:
    ```bash
    cd ../server
    ```

6. Install required dependencies:
    ```bash
    npm install
    ```

## Usage

To run the system:
1. Navigate into the project directory:
    ```bash
    cd SDP-Project
    ```

2. Navigate into the server directory:
    ```bash
    cd server
    ```

3. Ensure that _ALL_ lines containing the word `PORT` are *uncommented* in `index.js`. There are 4 occurences of `PORT`, two in a single line at the top of the `index.js` file, and two at the bottom of the file.

4. Start the local backend:
    ```bash
    npx nodemon index.js
    ```

5. Navigate into the client directory:
    ```bash
    cd ../client
    ```

6. Start the local frontend:
    ```bash
    npm run start
    ```

## Deployment
To deploy the system:
1. Ensure that _ALL_ lines containing the word `PORT` are *commented out* in `index.js`. There are 4 occurences of `PORT`, two in a single line at the top of the `index.js` file, and two at the bottom of the file.

2. Merge into the `development` branch:
    - Make sure that your feature branch is ready to be merged. Open a pull request and merge your branch into the `development` branch.
    
3. CircleCI Checks:
    - After merging into the `development` branch, CircleCI will automatically run the necessary checks (tests, builds, etc.). Ensure all checks pass.

4. Merge into the `main` branch:
    - Once CircleCI confirms that the checks have passed on the `development` branch, open a pull request to merge into the `main` branch.

5. Automatic Deployment:
    - Once the `main` branch is updated, the application will be automatically deployed.
