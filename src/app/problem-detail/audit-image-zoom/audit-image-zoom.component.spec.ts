import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuditImageZoomComponent } from './audit-image-zoom.component';

describe('AuditImageZoomComponent', () => {
  let component: AuditImageZoomComponent;
  let fixture: ComponentFixture<AuditImageZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditImageZoomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditImageZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
