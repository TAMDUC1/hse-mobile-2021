import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuditDetailPage } from './audit-detail.page';

describe('AuditDetailPage', () => {
  let component: AuditDetailPage;
  let fixture: ComponentFixture<AuditDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
