import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() resultEvent: EventEmitter<any> = new EventEmitter();
  aggregations!: any;
  hits!: [];

  query!: string;
  searched: boolean = false;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  search() {
    this.searchService.search(this.query).subscribe((result: any) => {
      this.resultEvent.emit(result.hits);
      this.aggregations = result.aggs;
      this.hits = result.hits;
      this.searched = true;
      console.log(result)
    });
  }

  clear() {
    this.query = '';
    this.resultEvent.emit([]);
    this.searched = false;
  }

  filterBySinger(key: any) {
    const newArr: any[] = [];
    this.hits.forEach((hit:any) => {
      if (hit._source.singers) {
        hit._source.singers.forEach((singer: any) => {
          if (singer === key) {
            newArr.push(hit);
          }
        });
      }
    });
    this.resultEvent.emit(newArr);
  }

  filterByLyricist(key: any) {
    const newArr: any[] = [];
    this.hits.forEach((hit:any) => {
      if (hit._source.lyricist) {
          if (hit._source.lyricist === key) {
            newArr.push(hit);
          };
      }
    });
    this.resultEvent.emit(newArr);
  }

  filterByComposer(key: any) {
    const newArr: any[] = [];
    this.hits.forEach((hit:any) => {
      if (hit._source.composer) {
          if (hit._source.composer === key) {
            newArr.push(hit);
          };
        }
    });
    this.resultEvent.emit(newArr);
  }
}
