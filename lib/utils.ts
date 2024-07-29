import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const generateInvoiceNumber = (dateOfIssue: string, invoiceNumber: string) => {
    const issueDate = parse(dateOfIssue, 'yyyy-MM-dd', new Date());
    const formattedDate = format(issueDate, 'yyyy/MM');
    return `${formattedDate}/${invoiceNumber}`;
};




export function amountToWords(amount: number | string): string {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertLessThanOneThousand(num: number): string {
        if (num === 0) return '';
        if (num < 20) return units[num];
        if (num < 100) {
            const ten = Math.floor(num / 10);
            const one = num % 10;
            return (tens[ten] + (one !== 0 ? ' ' + units[one] : '')).trim();
        }
        // Handle numbers from 100 to 999
        const hundred = Math.floor(num / 100);
        const rest = num % 100;
        return units[hundred] + ' Hundred' + (rest !== 0 ? ' and ' + convertLessThanOneThousand(rest) : '');
    }

    function convert(num: number): string {
        if (num === 0) return 'Zero';
        let word = '';
        let scaleIndex = 0;

        while (num > 0) {
            if (num % 1000 !== 0) {
                const chunk = convertLessThanOneThousand(num % 1000);
                word = chunk + (chunk ? ' ' + scales[scaleIndex] : '') + (word ? ' ' + word : '');
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }

        return word.trim();
    }

    // Handle potential string input (e.g., from form fields)
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return 'Invalid Amount';
    }

    const naira = Math.floor(numericAmount);
    const kobo = Math.round((numericAmount - naira) * 100);

    let result = convert(naira);
    if (result === 'Zero' && kobo === 0) {
        return 'Zero Naira Only';
    }

    result += ' Naira';
    if (kobo > 0) {
        result += ' and ' + convert(kobo) + ' Kobo';
    }
    return result + ' Only';
}

