using Application.DTOs;
using Application.Features.Contracts.Commands.CreateContract;
using Application.Features.Contracts.Commands.DeleteContract;
using Application.Features.Contracts.Commands.GetContract;
using Application.Features.Contracts.Commands.UpdateContract;
using MediatR;
using Microsoft.AspNetCore.Mvc;
namespace Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ContractController : ControllerBase
{
    private readonly IMediator _mediator;

    public ContractController(IMediator mediator)
    {
        _mediator = mediator;
    }

// 1. POST: Tạo mới -> Trả về 201
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateContract command)
    {
        try
        {
            var id = await _mediator.Send(command);

            // Chuẩn RESTful: Trả về 201 + Header Location trỏ đến link xem chi tiết
            return CreatedAtAction(nameof(GetById), new { id = id }, id);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
       
    }

    // 2. PUT: Cập nhật -> Trả về 204 (Hoặc 200)
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateContract command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID in URL and Body does not match"); // 400
        }

        try 
        {
            await _mediator.Send(command);
        }
        catch (Exception ex) // Giả sử Handler ném lỗi nếu không tìm thấy
        {
            // Cách thủ công (Cách xịn hơn là dùng Middleware - xem bên dưới)
            return NotFound(ex.Message); // 404
        }

        return NoContent(); // 204: Thành công nhưng không có nội dung trả về
    }

    // 3. GET: Lấy chi tiết -> 200 hoặc 404
    [HttpGet("{id}")]
    public async Task<ActionResult<ContractDto>> GetById(int id)
    {
        var query = new GetContractById { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound(); // 404: Không tìm thấy
        }

        return Ok(result); // 200: Thành công
    }
    // 4. DELETE: Xóa hợp đồng
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            // Tự tạo Command từ ID trên URL
            // Bạn không cần bắt Frontend gửi cả cục JSON, chỉ cần gửi ID là đủ
            var command = new DeleteContract { Id = id };
        
            await _mediator.Send(command);

            // Trả về 204 No Content (Xóa thành công, không còn dữ liệu để hiển thị)
            return NoContent();
        }
        catch (Exception ex)
        {
            // Nếu Handler ném lỗi (ví dụ không tìm thấy ID để xóa)
            // Trả về 404 Not Found
            return NotFound(new { message = ex.Message });
        }
    }
}