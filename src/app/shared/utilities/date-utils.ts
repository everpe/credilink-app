export const formatYearMonthDay = (date: any): string => {
    if (date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2); // Asegura que el mes tenga dos dígitos
      const day = ('0' + d.getDate()).slice(-2); // Asegura que el día tenga dos dígitos
      return `${year}-${month}-${day}`;
    }
    return '';
  };
  