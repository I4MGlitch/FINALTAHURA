  import { Component, HostListener, NgZone } from '@angular/core';
  import { FaunaService } from '../services/fauna.service';

  @Component({
    selector: 'app-fauna-page',
    templateUrl: './fauna-page.component.html',
    styleUrls: ['./fauna-page.component.css']
  })
  export class FaunaPageComponent {
    public faunas: any[] = [];
    searchTerm: string = '';
    private page: number = 1;
    private limit: number = 6;
    public isLoading: boolean = false;
    private hasMoreData: boolean = true;

    constructor(
      private fauna: FaunaService, 
      private ngZone: NgZone
    ){ }

    ngOnInit(): void {
      this.ngZone.runOutsideAngular(() => {
        this.getLoadFauna();
      })
    }

    filteredFaunas() {
      if (!this.searchTerm) {
        return this.faunas;
      }
      return this.faunas.filter(fauna =>
        fauna.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fauna.nameIlmiah.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    getLoadFauna(): void {
      if (this.isLoading || !this.hasMoreData) return; 
  
      this.isLoading = true;
      this.fauna.getLoadFauna(this.page, this.limit).subscribe(
        data => {
          if (data.length > 0) {
            this.faunas = [...this.faunas, ...data];
            this.page++;
          } else {
            this.hasMoreData = false;
          }
          this.isLoading = false;
        },
        error => {
          console.error('Error loading flora:', error);
          this.isLoading = false;
        }
      );
    }
  
    @HostListener('window:scroll', ['$event'])
    onScroll(event: any): void {
      
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) { // Adjust threshold as needed
        this.getLoadFauna();
      }
    }
    getErrorImageUrl(): string {
      return '../../assets/Images/logoTahura.png';
    }

    getImageUrl(imageData: any): string {
      if (imageData && imageData.data) {
        const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.contentType });
        return URL.createObjectURL(blob);
      }
      return this.getErrorImageUrl();
    }

    handleImageError(event: any, product: any) {
      console.error('Image loading error', product, event);
      product.errorImage = true;
    }
  }
