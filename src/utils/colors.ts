import Color from 'color';

export const getColorString = (hexColor: string) => Color(hexColor).rgb().string();

export const colors = {
  primary: getColorString('#3B82F6'),
  secondary: getColorString('#8B5CF6'),
  success: getColorString('#10B981'),
  warning: getColorString('#F59E0B'),
  error: getColorString('#EF4444'),
  gray: {
    50: getColorString('#F9FAFB'),
    100: getColorString('#F3F4F6'),
    200: getColorString('#E5E7EB'),
    300: getColorString('#D1D5DB'),
    400: getColorString('#9CA3AF'),
    500: getColorString('#6B7280'),
    600: getColorString('#4B5563'),
    700: getColorString('#374151'),
    800: getColorString('#1F2937'),
    900: getColorString('#111827'),
  }
}; 