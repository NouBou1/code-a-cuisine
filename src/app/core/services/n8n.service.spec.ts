import { TimeoutError } from 'rxjs';
import { isRetryable } from './n8n.service';

describe('isRetryable', () => {
  it('repeats timeouts, network and server errors', () => {
    expect(isRetryable(new TimeoutError())).toBe(true);
    expect(isRetryable({ status: 0, message: 'No connection' })).toBe(true);
    expect(isRetryable({ status: 503, message: 'Unavailable' })).toBe(true);
  });

  it('does not repeat client errors', () => {
    expect(isRetryable({ status: 400, message: 'Invalid' })).toBe(false);
    expect(isRetryable({ status: 422, message: 'Not enough' })).toBe(false);
    expect(isRetryable(new Error('unknown'))).toBe(false);
  });
});
