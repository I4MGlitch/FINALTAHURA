import { Component, HostListener, NgZone } from '@angular/core';
import { FloraService } from '../services/flora.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flora-page',
  templateUrl: './flora-page.component.html',
  styleUrls: ['./flora-page.component.css']
})
export class FloraPageComponent {
  public floras: any[] = [];
  searchTerm: string = '';
  private page: number = 1;
  private limit: number = 6;
  public isLoading: boolean = false;
  private hasMoreData: boolean = true;

  constructor(
    private floraService: FloraService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.loadFloraData();
    });
  }

  onSearch() {
    if (this.searchTerm) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchTerm } });
    }
  }

  filteredFloras() {
    if (!this.searchTerm) {
      return this.floras;
    }
    return this.floras.filter(flora =>
      flora.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      flora.nameIlmiah.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadFloraData(): void {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;
    this.floraService.getLoadFlora(this.page, this.limit).subscribe(
      data => {
        if (data.length > 0) {
          this.floras = [...this.floras, ...data];
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
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) { // Adjust threshold as needed
      this.loadFloraData();
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

  handleImageError(event: any, flora: any) {
    console.error('Image loading error', flora, event);
    flora.errorImage = true;
  }
}
