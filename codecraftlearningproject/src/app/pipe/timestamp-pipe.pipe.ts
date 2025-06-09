import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampPipe',
  standalone: true
})
export class TimestampPipePipe implements PipeTransform {

  transform(timestamp: any): any {
    return new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)).toDateString()
  }

}
