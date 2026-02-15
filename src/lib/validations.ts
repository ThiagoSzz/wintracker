export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'nameRequired';
  }
  
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    return 'nameMinWords';
  }
  
  return null;
};

export const sanitizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};