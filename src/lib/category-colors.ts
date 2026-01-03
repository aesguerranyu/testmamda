/**
 * Centralized category color definitions
 * All components should import from here for consistency
 */

export const CATEGORY_COLORS: Record<string, string> = {
  // Yellow categories
  "Affordability": "#FCCC0A",
  "Revenue": "#FCCC0A",
  "Small Business": "#FCCC0A",
  "Economy": "#FCCC0A",
  "Economic Justice": "#FCCC0A",
  
  // Red categories
  "Childcare": "#EE352E",
  "Healthcare": "#EE352E",
  "Housing": "#EE352E",
  "Health": "#EE352E",
  
  // Green categories
  "Climate": "#6CBE45",
  "Environment": "#6CBE45",
  "Transportation": "#00933C",
  
  // Blue categories
  "Education": "#0039A6",
  "Libraries": "#0039A6",
  
  // Gray categories
  "Governance": "#A7A9AC",
  "Technology": "#A7A9AC",
  "Government Reform": "#A7A9AC",
  
  // Purple categories
  "Immigration": "#B933AD",
  "Safety": "#B933AD",
  "Public Safety": "#B933AD",
  
  // Brown category
  "Labor": "#996633",
  
  // Orange category
  "LGBTQIA+": "#FF6319",
};

// Default fallback color
export const DEFAULT_CATEGORY_COLOR = "#A7A9AC";

/**
 * Get the color for a category
 * @param category - The category name
 * @returns The hex color code for the category
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || DEFAULT_CATEGORY_COLOR;
}

/**
 * Get the text color to use on a category background
 * Yellow backgrounds need dark text, all others use white
 * @param category - The category name
 * @returns The hex color code for text
 */
export function getCategoryTextColor(category: string): string {
  const yellowCategories = ["Affordability", "Revenue", "Small Business", "Economy", "Economic Justice"];
  return yellowCategories.includes(category) ? "#000000" : "#FFFFFF";
}
