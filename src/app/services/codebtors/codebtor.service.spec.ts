import { TestBed } from '@angular/core/testing';

import { CodebtorService } from './codebtor.service';

describe('CodebtorService', () => {
  let service: CodebtorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodebtorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
