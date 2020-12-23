import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KeywordsDocumentPage } from './keywords-document.page';

describe('KeywordsDocumentPage', () => {
  let component: KeywordsDocumentPage;
  let fixture: ComponentFixture<KeywordsDocumentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordsDocumentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordsDocumentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
