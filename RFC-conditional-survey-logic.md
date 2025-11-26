# RFC: Conditional Logic for Survey Questions

## Problem Statement

Our survey shows all questions to all respondents, leading to:

- Longer survey completion times
- Lower response rates
- Irrelevant questions for many users (e.g., "plans to return to Morocco" shown to everyone, even those not working abroad)

**Goal**: Add conditional logic to show/hide questions and sections based on previous answers.

## Proposed YAML Schema

### Current Format (No Changes for Existing Surveys)

```yaml
title: Profile
label: profile
position: 1
questions:
  - label: Where are you currently working?
    required: true
    choices:
      - Currently working in Morocco
      - Currently working outside Morocco
      - Not currently working
```

### New Format: Simple Conditions (Recommended)

Add optional `showIf` field to questions:

```yaml
questions:
  - label: Where are you currently working?
    required: true
    choices:
      - Currently working in Morocco
      - Currently working outside Morocco
      - Not currently working
      - Student

  # Only show if user selected "Currently working outside Morocco" (index 1)
  - label: Do you have any plans to come back to Morocco?
    required: true
    showIf:
      question: profile-q-0 # References question by ID
      equals: 1 # Choice index
    choices:
      - Yes, within 12 months
      - Yes, within 24 months
      - No plans to return
```

**Simple Condition Operators:**

```yaml
# Single choice - exact match
showIf:
  question: profile-q-2
  equals: 1

# Single choice - not equal
showIf:
  question: work-q-0
  notEquals: 3

# Single choice - one of multiple values
showIf:
  question: work-q-0
  in: [0, 1, 2]  # Employed full-time, part-time, or freelancer

# Multiple choice - user selected specific option
showIf:
  question: tech-q-5
  includes: 3  # User checked choice index 3

# Check if question was answered (not skipped)
showIf:
  question: work-q-2
  answered: true
```

### Advanced Format: Complex Conditions (When Needed)

For complex scenarios requiring AND/OR logic:

```yaml
questions:
  - label: Are you satisfied with your work-life balance?
    required: true
    conditions:
      and: # All must be true
        - question: work-q-0
          operator: equals
          value: 0 # Full-time employed
        - question: profile-q-2
          operator: equals
          value: 0 # Working in Morocco
    choices:
      - Very satisfied
      - Satisfied
      - Dissatisfied

  - label: What are your freelancing challenges?
    required: true
    conditions:
      or: # At least one must be true
        - question: work-q-0
          operator: equals
          value: 2 # Freelancer
        - question: work-q-0
          operator: equals
          value: 1 # Part-time
    choices:
      - Finding clients
      - Pricing services
```

**Advanced Operators:**

```yaml
# All operators from simple format, plus:
operator: notIn
operator: includesAny     # For multiple choice: has any of these
operator: includesAll     # For multiple choice: has all of these
operator: notIncludes
operator: notAnswered
```

### Section-Level Conditions

Hide entire sections based on profile answers:

```yaml
title: Work Experience
label: work
position: 3

# Only show this section if user is not a student
showIf:
  question: profile-q-3 # Occupation
  notEquals: 3 # Student choice index

questions:
  - label: What is your job title?
    # ... rest of questions
```

Or with advanced conditions:

```yaml
title: Advanced Career Topics
label: career
position: 5

conditions:
  and:
    - question: profile-q-5 # Years of experience
      operator: in
      value: [3, 4, 5] # 3+ years
    - question: work-q-0
      operator: in
      value: [0, 1, 2] # Currently employed

questions:
  # ... questions only for experienced employed developers
```

## Cross-Section References

Questions can reference answers from any previous section:

```yaml
# In work.yml (section 3)
questions:
  - label: Would you consider remote work abroad?
    showIf:
      question: profile-q-2 # From profile.yml (section 1)
      equals: 0 # Currently in Morocco
    choices:
      - Yes
      - No
```

## Question ID Format

Question IDs follow the pattern: `{section-label}-q-{index}`

Examples:

- `profile-q-0` - First question in profile section
- `profile-q-1` - Second question in profile section
- `work-q-0` - First question in work section

**Important**: Index is zero-based and represents the question's position in the YAML file.

## Answer Data Format (No Changes)

Conditional logic doesn't change how answers are stored:

```javascript
{
  "profile-q-0": 1,           // Single choice: index 1
  "tech-q-2": [0, 2, 4],      // Multiple choice: indices array
  "work-q-5": null,           // Skipped question
  "profile-q-8": 5,           // "Other" selected
  "profile-q-8-others": "Text input"  // Other text
}
```

Hidden questions are simply not answered (null or not present).

## Operator Reference Table

| Operator      | Question Type   | Description                         | Example               |
| ------------- | --------------- | ----------------------------------- | --------------------- |
| `equals`      | Single choice   | Answer equals specific value        | `equals: 1`           |
| `notEquals`   | Single choice   | Answer not equal to value           | `notEquals: 2`        |
| `in`          | Single choice   | Answer is one of these values       | `in: [0, 1, 2]`       |
| `notIn`       | Single choice   | Answer is not one of these values   | `notIn: [3, 4]`       |
| `includes`    | Multiple choice | Answer array includes value         | `includes: 3`         |
| `notIncludes` | Multiple choice | Answer array doesn't include value  | `notIncludes: 4`      |
| `includesAny` | Multiple choice | Answer has any of these values      | `includesAny: [0, 1]` |
| `includesAll` | Multiple choice | Answer has all of these values      | `includesAll: [1, 3]` |
| `answered`    | Any             | Question was answered (not skipped) | `answered: true`      |
| `notAnswered` | Any             | Question was skipped                | `notAnswered: true`   |

## Use Cases

### Use Case 1: Work Status Follow-ups

```yaml
- label: Current employment status?
  choices:
    - Employed full-time
    - Employed part-time
    - Freelancer
    - Student
    - Unemployed

- label: Your job title?
  showIf:
    question: work-q-0
    in: [0, 1, 2] # Any employed status
  choices:
    - Frontend Developer
    - Backend Developer

- label: Are you looking for work?
  showIf:
    question: work-q-0
    in: [3, 4] # Student or unemployed
  choices:
    - Yes, actively
    - No
```

### Use Case 2: Location-Based Questions

```yaml
- label: Where do you work?
  choices:
    - Morocco
    - Outside Morocco

- label: Which Moroccan city?
  showIf:
    question: profile-q-5
    equals: 0
  choices:
    - Casablanca
    - Rabat

- label: Do you plan to return to Morocco?
  showIf:
    question: profile-q-5
    equals: 1
  choices:
    - Yes
    - No
```

### Use Case 3: Experience-Based Sections

```yaml
title: Senior Developer Topics
label: senior
position: 7

showIf:
  question: profile-q-4 # Years of experience
  in: [4, 5] # 5+ years

questions:
  - label: Do you mentor junior developers?
    choices:
      - Yes, regularly
      - Occasionally
      - No
```

## Backward Compatibility

- ✅ Existing surveys without conditions work unchanged
- ✅ Questions without `showIf` or `conditions` are always visible
- ✅ Sections without conditions are always visible
- ✅ Answer data format remains the same

## Implementation Notes

1. **Hybrid approach**: Support both simple `showIf` and advanced `conditions` formats
2. **Auto-detection**: Parser determines format based on field structure
3. **Validation**: Question IDs in conditions should be validated against existing questions
4. **Order dependency**: Conditions can only reference previous questions (to avoid circular dependencies)
5. **Progressive enhancement**: Start with simple cases, add complexity as needed

## Questions for Discussion

1. Should we allow forward references (referencing questions that come later)?
2. Should we add a "preview mode" to test conditions without submitting?
3. Should section-level conditions be required, or is question-level enough initially?
4. Do we need a visual indicator in the survey that questions were skipped due to conditions?

## Next Steps

1. Gather feedback on YAML format proposal
2. Decide on operator set (minimal vs comprehensive)
3. Create TypeScript types for conditional logic
4. Implement condition evaluation engine
5. Update survey components to support filtering
6. Write tests and documentation
7. Add sample conditions to one section as a pilot

---

**Status**: RFC / Seeking Feedback
**Created**: 2025-01-23
**Author**: GeeksBlaBla Team
