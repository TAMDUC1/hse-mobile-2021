import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KeywordsHomePage } from './keywords-home.page';

describe('KeywordsHomePage', () => {
  let component: KeywordsHomePage;
  let fixture: ComponentFixture<KeywordsHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordsHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
