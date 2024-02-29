import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../service/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrl: './hero-search.component.css',
})
export class HeroSearchComponent implements OnInit{

  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // รอจนกระทั่งโฟลว์ของเหตุการณ์สตริงใหม่หยุดชั่วคราวเป็นเวลา 300 มิลลิวินาทีก่อนจะส่งต่อไปตามสตริงล่าสุด คำขอไม่น่าจะเกิดขึ้นบ่อยเกินกว่า 300 มิลลิวินาที
      debounceTime(300),

      // ตรวจสอบให้แน่ใจว่าคำขอถูกส่งเฉพาะเมื่อข้อความตัวกรองเปลี่ยนไป
      distinctUntilChanged(),

      // เรียกใช้บริการการค้นหาสำหรับ คำค้นหาแต่ละคำที่ส่งผ่านdebounce()และ distinctUntilChanged()จะยกเลิกและละทิ้งการค้นหาที่สังเกตได้ก่อนหน้านี้ โดยส่งคืนเฉพาะบริการค้นหาล่าสุดที่สังเกตได้
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
