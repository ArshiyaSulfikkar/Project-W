# iOS Architecture

Folder Structure

ProjectW-iOS
├── Models
├── Views
├── ViewModels
├── Services
└── Assets

API Communication

SwiftUI App
↓
URLSession
↓
NestJS REST API
↓
PostgreSQL Database

Authentication

JWT Token based authentication will be used.
