import { expect, it, vi } from 'vitest';
import { GalleryMedia } from '../../src/lib/curved-gallery/media';
it('reclaims off-neighbor GPU textures and video callbacks, and destroys retained resources',()=>{
 const gl={deleteTexture:vi.fn()} as unknown as WebGLRenderingContext;
 const media=new GalleryMedia(gl,[],vi.fn(),vi.fn());
 const video={pause:vi.fn(),load:vi.fn(),removeAttribute:vi.fn(),cancelVideoFrameCallback:vi.fn(),onloadedmetadata:vi.fn()} as unknown as HTMLVideoElement;
 const entry=()=>({media:{} as WebGLTexture,overlay:{} as WebGLTexture,videoDirty:false,videoTime:0,playing:false});
 media.resources[0]=entry();media.resources[1]={...entry(),video,frameId:7,playing:true};
 media.retain(new Set([0]));expect(media.resources[0]).toBeDefined();expect(media.resources[1]).toBeUndefined();
 expect(video.pause).toHaveBeenCalledOnce();expect(video.cancelVideoFrameCallback).toHaveBeenCalledWith(7);expect(video.onloadedmetadata).toBeNull();expect(gl.deleteTexture).toHaveBeenCalledTimes(2);
 media.destroy();expect(media.resources.filter(Boolean)).toHaveLength(0);expect(gl.deleteTexture).toHaveBeenCalledTimes(4);
});
