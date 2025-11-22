import { timerConfigs } from "../lib/timerConfigs";

function validateTimers() {
  const errors: string[] = [];
  const slugs = new Set<string>();

  timerConfigs.forEach((config, index) => {
    // Check for duplicate slugs
    if (slugs.has(config.slug)) {
      errors.push(`Duplicate slug found: "${config.slug}" at index ${index}`);
    } else {
      slugs.add(config.slug);
    }

    // Check for valid minutes
    if (config.minutes <= 0) {
      errors.push(
        `Invalid minutes (${config.minutes}) for timer "${config.slug}" - must be > 0`
      );
    }

    // Check for non-empty descriptions
    if (!config.description || config.description.trim().length === 0) {
      errors.push(`Empty description for timer "${config.slug}"`);
    }

    // Check for non-empty labels
    if (!config.label || config.label.trim().length === 0) {
      errors.push(`Empty label for timer "${config.slug}"`);
    }

    // Check for non-empty slugs
    if (!config.slug || config.slug.trim().length === 0) {
      errors.push(`Empty slug at index ${index}`);
    }
  });

  if (errors.length > 0) {
    console.error("❌ Timer validation failed:\n");
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  } else {
    console.log(`✅ All ${timerConfigs.length} timers validated successfully!`);
    console.log(`   - ${timerConfigs.filter((t) => t.type === "simple").length} simple timers`);
    console.log(`   - ${timerConfigs.filter((t) => t.type === "pomodoro").length} pomodoro timers`);
  }
}

validateTimers();

