import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {
  transform(isoString: string | null | undefined): string {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', isoString);
      return '';
    }

    const now = new Date();
    const minutesAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    // If it's older than a year
    if (date.getFullYear() < now.getFullYear()) {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    // If it's within the last hour
    if (minutesAgo < 60) {
      if (minutesAgo < 1) return 'just now';
      return `${minutesAgo} min ago`;
    }

    // If it's within 24 hours
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    }
    
    // If it's yesterday
    if (daysAgo === 1) {
      return `yesterday ${timeStr}`;
    }
    
    // If it's within the last week
    if (daysAgo < 7) {
      return `${daysAgo} days ago`;
    }
    
    // If it's this year but more than a week ago
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short'
    }) + ` ${timeStr}`;
  }
}