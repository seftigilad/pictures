using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PictureObjects;
using System;

namespace Pictures.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PicturesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PicturesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetPictures()
        {
            var pictures = await _db.Pictures.Select(p => new
            {
                p.Id,
                p.Name
            }).ToListAsync();

            return Ok(pictures);
        }

        [HttpPut]
        public async Task<IActionResult> AddPicture([FromForm] PictureDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.File == null || dto.File.Length == 0)
                return BadRequest("Missing mandatory fields");

            if (dto.Name.Length > 50)
                return BadRequest("Name is too long");

            if (dto.Description?.Length > 250)
                return BadRequest("Description is too long");

            var existing = await _db.Pictures.AnyAsync(p => p.FileName == dto.File.FileName);
            if (existing)
                return BadRequest("A file with this name already exists");

            using var ms = new MemoryStream();
            await dto.File.CopyToAsync(ms);

            var picture = new Picture
            {
                Name = dto.Name,
                Description = dto.Description,
                FileName = dto.File.FileName,
                Date = dto.Date,
                Content = ms.ToArray()
            };

            _db.Pictures.Add(picture);
            await _db.SaveChangesAsync();

            return Ok(picture.Id);
        }
    }

}
