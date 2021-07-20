$(function () {
  var layer = layui.layer
  var form = layui.form
  // 显示分类列表
  initArtCateList();
  // 为添加类别按钮绑定点击事件
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1, // 页面层 （具体看官网）
      area: ['500px', '250px'],
      title: '添加文章分类',
      // 这里可以使用模板在进行添加
      content: $('#dialog-add').html()
    })
  })
  // 不能根据id 进行绑定 
  // 理由是 我们的表单是点击按钮之后 才插入到页面的 content: $('#dialog-add').html()
  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  // 给body绑定 提交事件 代理到form-add上
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  });
  // 通过代理的形式，为 btn-edit 按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    // 获取id
    var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 记得给form添加lay-filter的值
        form.val('form-edit', res.data)
      }
    })
  })
  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  });
  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })

})

// 获取文章分类的列表
function initArtCateList() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: function (res) {
      // 设置模板和数据
      var htmlStr = template('tpl-table', res)
      // 将模板实现在页面上
      $('tbody').html(htmlStr)
    }
  })
}