import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent implements OnInit {
  @Input() totalItems;
  @Input() goFirstPage;
  @Input() currentItemCountPerPage;
  @Input() routeParams;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  currentPage = +window.location.pathname.split('/').pop();

  isNewed = true;

  from = 0;
  to = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getInterval();

    localStorage.setItem('itemsPerPage', this.currentItemCountPerPage.toString());
  }

  ngOnChanges() {
    console.log('changed');

    if (this.goFirstPage) {
      this.isNewed = false;
      setTimeout(() => {
        this.routeTo(1, false);
        this.isNewed = true;
      }, 100);
    }
  }

  getInterval() {
    this.from = this.currentPage * this.currentItemCountPerPage - this.currentItemCountPerPage + 1;
    this.to = (this.totalItems <= this.currentPage * this.currentItemCountPerPage) ? this.totalItems : (this.currentPage * this.currentItemCountPerPage);
  }

  setCurrentPageItemCount(i) {
    this.currentItemCountPerPage = i;
    localStorage.setItem('itemsPerPage', this.currentItemCountPerPage.toString());

    this.isNewed = false;
    setTimeout(() => {
      this.routeTo(1);
      this.isNewed = true;
    }, 100);
  }

  routeTo(i, cond = true) {
    console.log('toure');
    console.log(this.route.snapshot.queryParams);


    const pathname = window.location.pathname;
    const mainPath = pathname.slice(0, pathname.length - pathname.split('/').pop().length);

    if (cond) {
      this.onChange.emit({ itemCountPerPage: this.currentItemCountPerPage, activePage: i })
    }

    console.log(this.routeParams);

    this.router.navigate([mainPath + i], { queryParams: this.routeParams });
    this.currentPage = i;

    this.getInterval();
  }

}
