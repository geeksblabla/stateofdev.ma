#!/bin/bash

# Run expo-doctor and capture output and exit code
output=$(node ../../scripts/validate-survey.ts 2>&1)
exit_code=$?

# Output file location
output_file=".astro/survey-questions-validation.md"
# Create .astro directory if it doesn't exist
mkdir -p ".astro"

{
  # Add summary based on exit code
  if [ $exit_code -eq 0 ]; then
    echo "✅ **Good news!** We ran Validate Survey Questions for this PR and everything looks good, Great job!" > "$output_file"
  else
    echo "❌ **Action Required:**  We ran Validate Survey Questions for this PR and found some issues that need to be addressed. Please review the complete report below 👇" > "$output_file"
    echo >> "$output_file"  # Add blank line
    echo "\`\`\`shell" >> "$output_file"
    echo "$output" >> "$output_file"
    echo "\`\`\`" >> "$output_file"
  fi
}

# Show original output in terminal
echo "$output"

# Return the original exit code
exit $exit_code