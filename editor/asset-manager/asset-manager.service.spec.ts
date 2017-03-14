/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AssetManagerService } from './asset-manager.service';

describe('Service: AssetManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetManagerService]
    });
  });

  it('should ...', inject([AssetManagerService], (service: AssetManagerService) => {
    expect(service).toBeTruthy();
  }));
});
