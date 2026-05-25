import { describe, expect, it } from 'bun:test'
import {
  isSameOrInsidePathForPlatform,
  normalizeDriveRootPathForPlatform,
} from '../services/windowsDrivePath.js'
import { SessionService } from '../services/sessionService.js'

describe('Windows drive root path handling', () => {
  it('normalizes drive-relative root inputs to absolute drive roots on Windows', () => {
    expect(normalizeDriveRootPathForPlatform('D:', 'win32')).toBe('D:\\')
    expect(normalizeDriveRootPathForPlatform('d:', 'win32')).toBe('d:\\')
    expect(normalizeDriveRootPathForPlatform('D:\\', 'win32')).toBe('D:\\')
    expect(normalizeDriveRootPathForPlatform('D:\\project', 'win32')).toBe('D:\\project')
    expect(normalizeDriveRootPathForPlatform('D:', 'darwin')).toBe('D:')
  })

  it('recovers sanitized Windows drive-root transcript directories', () => {
    const service = new SessionService()
    expect(service.desanitizePath('D--')).toBe('D:\\')
    expect(service.desanitizePath('D--project')).toBe('D:\\project')
  })

  it('treats absolute Windows drive-root children as inside the selected root', () => {
    expect(isSameOrInsidePathForPlatform('D:\\', 'D:', 'win32')).toBe(true)
    expect(isSameOrInsidePathForPlatform('D:\\child', 'D:', 'win32')).toBe(true)
    expect(isSameOrInsidePathForPlatform('D:\\child', 'D:\\', 'win32')).toBe(true)
    expect(isSameOrInsidePathForPlatform('D:\\project-extra', 'D:\\project', 'win32')).toBe(false)
    expect(isSameOrInsidePathForPlatform('E:\\child', 'D:\\', 'win32')).toBe(false)
  })
})
