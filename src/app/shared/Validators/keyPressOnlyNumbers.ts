export function KeyPressOnlyNumbersValidator(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) { // Rango ASCII para números
      event.preventDefault();
    }
  }