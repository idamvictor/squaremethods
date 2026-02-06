# Procedures with Nested Precautions - Refactoring Summary

## Overview

Refactored the Job Aids system to nest precautions within procedures instead of treating them as separate entities. Precautions are now optional fields within each procedure.

## Changes Made

### 1. **Type Definitions** (`services/job-aid/job-aid-types.ts`)

- ✅ Created new `ProcedurePrecaution` interface for nested precautions
- ✅ Updated `JobAidProcedure` to include optional `precautions?: ProcedurePrecaution[]`
- ✅ Updated `JobAidProcedureList` to include optional `precautions?: ProcedurePrecaution[]`
- ✅ Updated `CreateJobAidProcedureInput` to include optional `precautions?: ProcedurePrecaution[]`
- ✅ Updated `UpdateJobAidProcedureInput` to include optional `precautions?: ProcedurePrecaution[]`

### 2. **Image Annotation Manager** (`components/user/job-aids/image-annotation/image-annotation-manager.tsx`)

- ✅ Refactored to only handle procedures (removed separate precaution mode)
- ✅ Added UI for adding/editing optional precautions within each procedure
- ✅ Precautions section shows as amber-colored optional box under each procedure
- ✅ Users can add multiple precautions per procedure with "Add Precaution" button
- ✅ Each precaution has instruction field and can be removed individually
- ✅ Save/update operations include nested precautions in the API payload
- ✅ Only fetches procedure data (simplified from fetching both procedures and precautions)

### 3. **Job Aid Details Component** (`components/user/job-aids/job-aid-details.tsx`)

- ✅ Removed separate "Precautions" section
- ✅ Updated "Procedures" section to display precautions nested under each procedure
- ✅ Procedures now show with numbered steps and amber warning box for precautions
- ✅ Removed separate "Add Precaution" button
- ✅ Single "Add Procedure with Optional Precautions" button to create/edit
- ✅ Simplified view mode (only details and procedures, no separate precautions view)

## Data Structure Example

**Before:**

```json
{
  "jobAid": {
    "procedures": [{ "id": "1", "instruction": "Step 1", "image": "..." }],
    "precautions": [
      { "id": "p1", "instruction": "Safety warning", "image": "..." }
    ]
  }
}
```

**After:**

```json
{
  "jobAid": {
    "procedures": [
      {
        "id": "1",
        "instruction": "Step 1",
        "image": "...",
        "precautions": [
          {
            "id": "p1",
            "title": "Warning 1",
            "instruction": "Safety warning",
            "image": "..."
          },
          {
            "id": "p2",
            "title": "Warning 2",
            "instruction": "Second warning",
            "image": "..."
          }
        ]
      }
    ]
  }
}
```

## Key Features

### Procedure Creation/Editing

- Each procedure has a main instruction and image annotation
- Optional precautions can be added to any procedure
- Precautions are associated with the procedure they belong to
- Users can add multiple precautions with different instructions
- Precautions share the annotated image from the procedure

### UI/UX Improvements

- Clear visual hierarchy with numbered procedures
- Precautions displayed in amber warning boxes for visibility
- Single workflow for creating procedures with optional precautions
- Easy to add/remove precautions inline
- Clearer distinction between procedure instructions and precautions

## Files Modified

1. `services/job-aid/job-aid-types.ts` - Type definitions
2. `components/user/job-aids/image-annotation/image-annotation-manager.tsx` - Manager component
3. `components/user/job-aids/job-aid-details.tsx` - Details display component

## API Integration

The API mutations now send procedures with nested precautions:

```typescript
{
  job_aid_id: "...",
  title: "Procedure title",
  step: 1,
  instruction: "Step instruction",
  image: "image_url",
  precautions: [
    {
      id: "...",
      title: "Precaution title",
      instruction: "Precaution instruction",
      image: "image_url"
    }
  ]
}
```

## Notes

- Precautions are optional and the system works fine without them
- Each procedure can have multiple precautions
- The refactoring maintains backward compatibility with existing data structures
- No changes needed to the job-aid-queries.ts file as it still manages procedure CRUD operations
