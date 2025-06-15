using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PictureObjects
{
    public class Picture
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Description { get; set; }

        public DateTime? Date { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public byte[] Content { get; set; } = [];
    }
}
