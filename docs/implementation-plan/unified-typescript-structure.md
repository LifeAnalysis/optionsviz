# Unified TypeScript Structure Migration - Implementation Plan

## Background and Motivation

The current project has separate `backend/` and `frontend/` folders, which creates unnecessary complexity for a TypeScript-based project. The user has requested merging these into a unified TypeScript structure that follows modern monorepo patterns and reduces duplication of configuration, dependencies, and types.

**Key Business Value:**
- Simplified project structure with unified TypeScript configuration
- Shared type definitions between client and server code
- Single dependency management and build system
- Improved developer experience with unified tooling
- Better code organization following modern TypeScript project patterns

**Current Structure Issues:**
- Duplicate TypeScript configurations (backend/tsconfig.json vs frontend/tsconfig.json)
- Separate package.json files requiring individual dependency management
- Type duplication between backend and frontend
- Complex build and development scripts in root package.json
- Inconsistent module systems (CommonJS backend vs ESM frontend)

## Key Challenges and Analysis

### Technical Challenges
1. **Module System Alignment**: Backend uses CommonJS while frontend uses ESM - need to standardize
2. **Dependency Consolidation**: Merging dependencies from backend and frontend package.json files
3. **Build System Unification**: Creating unified build process for both client and server
4. **Type Sharing**: Moving types to shared location accessible by both client and server
5. **Development Workflow**: Maintaining concurrent development of client and server components

### Proposed Unified Structure
```
optionsviz/
├── package.json (unified dependencies)
├── tsconfig.json (base configuration)
├── vite.config.ts (for frontend build)
├── src/
│   ├── client/ (React frontend)
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── server/ (Express backend)
│   │   ├── routes/
│   │   ├── database/
│   │   ├── data/
│   │   └── server.ts
│   ├── shared/ (shared types and utilities)
│   │   ├── types/
│   │   └── utils/
│   └── public/ (static assets)
├── dist/ (build output)
│   ├── client/
│   └── server/
└── docs/
```

### Technology Stack Standardization
- **Module System**: ESM throughout (aligned with Vite and modern Node.js)
- **TypeScript**: Unified tsconfig with project references
- **Build Tools**: Vite for frontend, TypeScript compiler for backend
- **Package Management**: Single package.json with workspace-like organization
- **Development**: Concurrent development with unified scripts

## High-level Task Breakdown

### Phase 1: Structure Preparation and Planning
1. **Analysis and Backup**
   - Create backup of current structure
   - Document all current dependencies and configurations
   - **Success Criteria**: Current structure documented and backed up

2. **Design Unified Package Configuration**
   - Merge dependencies from backend and frontend package.json
   - Create unified scripts for development and build
   - **Success Criteria**: Single package.json with all necessary dependencies and scripts

3. **Create Unified TypeScript Configuration**
   - Design base tsconfig.json with appropriate project references
   - Plan shared types structure
   - **Success Criteria**: TypeScript configuration supports both client and server

### Phase 2: File Structure Migration
4. **Create New Directory Structure**
   - Create src/ with client/, server/, shared/ subdirectories
   - Move public assets to appropriate location
   - **Success Criteria**: New directory structure created and ready for migration

5. **Migrate Frontend Code**
   - Move frontend/src/* to src/client/
   - Update import paths and configurations
   - Update Vite configuration for new structure
   - **Success Criteria**: Frontend code moved and builds successfully

6. **Migrate Backend Code**
   - Move backend/src/* to src/server/
   - Update import paths and module system to ESM
   - Update build configuration
   - **Success Criteria**: Backend code moved and builds successfully

### Phase 3: Shared Types and Integration
7. **Create Shared Types System**
   - Move common types to src/shared/types/
   - Update import statements in client and server
   - **Success Criteria**: Types are shared between client and server without duplication

8. **Update Build and Development Scripts**
   - Configure concurrent development of client and server
   - Set up build processes for both targets
   - **Success Criteria**: `npm run dev` starts both client and server, build works correctly

### Phase 4: Testing and Cleanup
9. **Comprehensive Testing**
   - Test development workflow
   - Test build process
   - Verify all functionality works as before
   - **Success Criteria**: All features work identically to previous structure

10. **Cleanup and Documentation**
    - Remove old backend/ and frontend/ directories
    - Update documentation and README
    - Update start.sh script
    - **Success Criteria**: Clean unified structure with updated documentation

## Branch Name
`feature/unified-typescript-structure`

## Project Status Board

### ✅ Completed Tasks
- [x] Project analysis and planning
- [x] Implementation plan documentation
- [x] Analysis and backup of current structure
- [x] Design unified package configuration
- [x] Create unified TypeScript configuration
- [x] Create new directory structure
- [x] Migrate frontend code
- [x] Migrate backend code
- [x] Create shared types system
- [x] Update build and development scripts
- [x] Comprehensive testing
- [x] Cleanup and documentation

### 🔄 In Progress Tasks
*None - Migration Complete*

### 📋 Pending Tasks
*None - Migration Complete*

## Current Status / Progress Tracking

**Current Phase**: ✅ MIGRATION COMPLETED  
**Status**: Unified TypeScript structure successfully implemented

### Migration Summary
**Date Completed**: [2024-12-19]
**Result**: Successfully migrated from separate backend/frontend folders to unified TypeScript structure

**New Project Structure**:
```
optionsviz/
├── package.json (unified dependencies)
├── tsconfig.json (base configuration) 
├── tsconfig.client.json (React frontend config)
├── tsconfig.server.json (Express backend config)
├── vite.config.ts (client build configuration)
├── src/
│   ├── client/ (React frontend - was frontend/src/)
│   │   ├── components/
│   │   ├── App.tsx, main.tsx, index.html
│   │   └── *.css files
│   ├── server/ (Express backend - was backend/src/)
│   │   ├── database/, data/
│   │   └── server.ts
│   └── shared/ (shared types and utilities)
│       └── types/index.ts
├── dist/ (build output)
│   ├── client/ (Vite build output)
│   └── server/ (TypeScript compiled output)
└── docs/
```

**Key Improvements Achieved**:
✅ Single package.json with unified dependency management  
✅ Shared TypeScript types between client and server  
✅ ESM modules throughout (converted from CommonJS backend)  
✅ TypeScript project references for optimal compilation  
✅ Unified development workflow with `npm run dev`  
✅ Consistent build system and tooling  
✅ Simplified project structure and maintenance

## Executor's Feedback or Assistance Requests

*This section will be updated by the Executor as work progresses*

## Technical Specifications

### Unified Package.json Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "express-rate-limit": "^7.1.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lightweight-charts": "^4.1.3",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "@types/sqlite3": "^3.1.11",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.0",
    "vite": "^4.5.0",
    "typescript": "^5.3.3",
    "tsx": "^4.6.2",
    "concurrently": "^8.2.2"
  }
}
```

### Unified Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
    "client:dev": "vite",
    "client:build": "vite build",
    "server:dev": "tsx watch src/server/server.ts",
    "server:build": "tsc --project tsconfig.server.json",
    "build": "npm run server:build && npm run client:build",
    "start": "node dist/server/server.js",
    "preview": "vite preview"
  }
}
```

### TypeScript Project References
- Base tsconfig.json with common settings
- tsconfig.client.json for React frontend (extends base)
- tsconfig.server.json for Express backend (extends base)
- Shared types in src/shared/types/

---
*Last updated: [2024-12-19] - Initial planning complete*
