/**
 * 管理员角色和权限配置
 * 根据设计图定义的管理员层级体系
 */

// 管理员角色枚举
export const AdminRole = {
  NONE: 'none',                    // 普通用户
  SUB_ADMIN: 'sub_admin',          // 子管理员（论坛子管理员）
  FORUM_ADMIN: 'forum_admin',      // 分管理员（论坛管理员）
  PLATFORM_SUB_ADMIN: 'platform_sub_admin', // 平台分管理员
  PLATFORM_ADMIN: 'platform_admin', // 平台管理员
  SUPER_ADMIN: 'super_admin'       // 总管理员
}

// 角色显示名称
export const AdminRoleName = {
  [AdminRole.NONE]: '普通用户',
  [AdminRole.SUB_ADMIN]: '子管理员',
  [AdminRole.FORUM_ADMIN]: '分管理员',
  [AdminRole.PLATFORM_SUB_ADMIN]: '平台分管理员',
  [AdminRole.PLATFORM_ADMIN]: '平台管理员',
  [AdminRole.SUPER_ADMIN]: '总管理员'
}

// 角色权限等级（数值越大权限越高）
export const AdminRoleLevel = {
  [AdminRole.NONE]: 0,
  [AdminRole.SUB_ADMIN]: 1,
  [AdminRole.FORUM_ADMIN]: 2,
  [AdminRole.PLATFORM_SUB_ADMIN]: 3,
  [AdminRole.PLATFORM_ADMIN]: 4,
  [AdminRole.SUPER_ADMIN]: 5
}

// 管理员操作类型
export const AdminAction = {
  // 内容管理
  DELETE_POST: 'delete_post',       // 删帖
  BAN_USER: 'ban_user',             // 封禁
  UNBAN_USER: 'unban_user',         // 解禁
  REMOVE_POST: 'remove_post',       // 下架
  RESTORE_POST: 'restore_post',     // 上架
  PIN_POST: 'pin_post',             // 置顶
  UNPIN_POST: 'unpin_post',         // 取消置顶
  EDIT_POST: 'edit_post',           // 编辑
  SET_HOT: 'set_hot',               // 设为热文
  SET_ANNOUNCEMENT: 'set_announcement',   // 设为公告
  CANCEL_ANNOUNCEMENT: 'cancel_announcement', // 取消公告

  // 用户管理
  VIEW_USER_ID: 'view_user_id',     // 查看ID
  SET_TITLE: 'set_title',           // 自定义头衔
  CANCEL_TITLE: 'cancel_title',     // 取消头衔

  // 管理员任命
  SET_SUB_ADMIN: 'set_sub_admin',             // 设为子管理员
  SET_FORUM_ADMIN: 'set_forum_admin',         // 设为分管理员
  SET_PLATFORM_SUB_ADMIN: 'set_platform_sub_admin', // 设为平台分管理员
  CANCEL_ADMIN: 'cancel_admin'                // 取消管理员
}

// 各角色的权限配置
export const RolePermissions = {
  // 总管理员 - 最高权限
  [AdminRole.SUPER_ADMIN]: [
    AdminAction.DELETE_POST,
    AdminAction.BAN_USER,
    AdminAction.UNBAN_USER,
    AdminAction.REMOVE_POST,
    AdminAction.RESTORE_POST,
    AdminAction.PIN_POST,
    AdminAction.UNPIN_POST,
    AdminAction.EDIT_POST,
    AdminAction.SET_HOT,
    AdminAction.SET_ANNOUNCEMENT,
    AdminAction.CANCEL_ANNOUNCEMENT,
    AdminAction.VIEW_USER_ID,
    AdminAction.SET_TITLE,
    AdminAction.CANCEL_TITLE,
    AdminAction.SET_SUB_ADMIN,
    AdminAction.SET_FORUM_ADMIN,
    AdminAction.CANCEL_ADMIN
  ],

  // 平台管理员
  [AdminRole.PLATFORM_ADMIN]: [
    AdminAction.DELETE_POST,
    AdminAction.BAN_USER,
    AdminAction.UNBAN_USER,
    AdminAction.REMOVE_POST,
    AdminAction.RESTORE_POST,
    AdminAction.PIN_POST,
    AdminAction.UNPIN_POST,
    AdminAction.EDIT_POST,
    AdminAction.SET_HOT,
    AdminAction.SET_ANNOUNCEMENT,
    AdminAction.CANCEL_ANNOUNCEMENT,
    AdminAction.VIEW_USER_ID,
    AdminAction.SET_TITLE,
    AdminAction.CANCEL_TITLE,
    AdminAction.SET_SUB_ADMIN,
    AdminAction.SET_FORUM_ADMIN,
    AdminAction.SET_PLATFORM_SUB_ADMIN,
    AdminAction.CANCEL_ADMIN
  ],

  // 平台分管理员
  [AdminRole.PLATFORM_SUB_ADMIN]: [
    AdminAction.DELETE_POST,
    AdminAction.BAN_USER,
    AdminAction.UNBAN_USER,
    AdminAction.REMOVE_POST,
    AdminAction.RESTORE_POST,
    AdminAction.UNPIN_POST,
    AdminAction.EDIT_POST,
    AdminAction.VIEW_USER_ID
  ],

  // 分管理员（论坛管理员）
  [AdminRole.FORUM_ADMIN]: [
    AdminAction.DELETE_POST,
    AdminAction.BAN_USER,
    AdminAction.UNBAN_USER,
    AdminAction.REMOVE_POST,
    AdminAction.RESTORE_POST,
    AdminAction.PIN_POST,
    AdminAction.UNPIN_POST,
    AdminAction.EDIT_POST,
    AdminAction.SET_HOT,
    AdminAction.SET_ANNOUNCEMENT,
    AdminAction.CANCEL_ANNOUNCEMENT,
    AdminAction.VIEW_USER_ID,
    AdminAction.SET_TITLE,
    AdminAction.CANCEL_TITLE,
    AdminAction.SET_SUB_ADMIN,
    AdminAction.CANCEL_ADMIN
  ],

  // 子管理员（论坛子管理员）
  [AdminRole.SUB_ADMIN]: [
    AdminAction.DELETE_POST,
    AdminAction.BAN_USER,
    AdminAction.UNBAN_USER,
    AdminAction.REMOVE_POST,
    AdminAction.RESTORE_POST,
    AdminAction.PIN_POST,
    AdminAction.UNPIN_POST,
    AdminAction.EDIT_POST,
    AdminAction.SET_HOT,
    AdminAction.SET_ANNOUNCEMENT,
    AdminAction.CANCEL_ANNOUNCEMENT,
    AdminAction.VIEW_USER_ID,
    AdminAction.SET_TITLE,
    AdminAction.CANCEL_TITLE
  ],

  // 普通用户 - 无管理权限
  [AdminRole.NONE]: []
}

// 操作按钮配置
export const ActionButtons = {
  [AdminAction.DELETE_POST]: { label: '删帖', type: 'danger' },
  [AdminAction.BAN_USER]: { label: '封禁', type: 'danger' },
  [AdminAction.UNBAN_USER]: { label: '解禁', type: 'success' },
  [AdminAction.REMOVE_POST]: { label: '下架', type: 'warning' },
  [AdminAction.RESTORE_POST]: { label: '上架', type: 'success' },
  [AdminAction.PIN_POST]: { label: '置顶', type: 'primary' },
  [AdminAction.UNPIN_POST]: { label: '取消置顶', type: 'default' },
  [AdminAction.EDIT_POST]: { label: '编辑', type: 'primary' },
  [AdminAction.SET_HOT]: { label: '设为热文', type: 'primary' },
  [AdminAction.SET_ANNOUNCEMENT]: { label: '设为公告', type: 'primary' },
  [AdminAction.CANCEL_ANNOUNCEMENT]: { label: '取消公告', type: 'default' },
  [AdminAction.VIEW_USER_ID]: { label: '查看ID', type: 'default' },
  [AdminAction.SET_TITLE]: { label: '自定义头衔', type: 'primary' },
  [AdminAction.CANCEL_TITLE]: { label: '取消头衔', type: 'default' },
  [AdminAction.SET_SUB_ADMIN]: { label: '设为子管理员', type: 'primary' },
  [AdminAction.SET_FORUM_ADMIN]: { label: '设为分管理员', type: 'primary' },
  [AdminAction.SET_PLATFORM_SUB_ADMIN]: { label: '设为平台分管理员', type: 'primary' },
  [AdminAction.CANCEL_ADMIN]: { label: '取消管理员', type: 'danger' }
}

/**
 * 检查是否有某个权限
 * @param {string} role - 用户角色
 * @param {string} action - 操作类型
 * @returns {boolean}
 */
export function hasPermission(role, action) {
  const permissions = RolePermissions[role] || []
  return permissions.includes(action)
}

/**
 * 获取用户可用的操作列表
 * @param {string} role - 用户角色
 * @param {object} context - 上下文信息（帖子状态等）
 * @returns {Array}
 */
export function getAvailableActions(role, context = {}) {
  const permissions = RolePermissions[role] || []
  const actions = []

  permissions.forEach(action => {
    // 根据上下文过滤操作
    let shouldShow = true

    // 根据帖子状态过滤
    if (context.isPinned && action === AdminAction.PIN_POST) {
      shouldShow = false
    }
    if (!context.isPinned && action === AdminAction.UNPIN_POST) {
      shouldShow = false
    }
    if (context.isRemoved && action === AdminAction.REMOVE_POST) {
      shouldShow = false
    }
    if (!context.isRemoved && action === AdminAction.RESTORE_POST) {
      shouldShow = false
    }
    if (context.isAnnouncement && action === AdminAction.SET_ANNOUNCEMENT) {
      shouldShow = false
    }
    if (!context.isAnnouncement && action === AdminAction.CANCEL_ANNOUNCEMENT) {
      shouldShow = false
    }
    if (context.isBanned && action === AdminAction.BAN_USER) {
      shouldShow = false
    }
    if (!context.isBanned && action === AdminAction.UNBAN_USER) {
      shouldShow = false
    }
    if (context.hasTitle && action === AdminAction.SET_TITLE) {
      shouldShow = false
    }
    if (!context.hasTitle && action === AdminAction.CANCEL_TITLE) {
      shouldShow = false
    }

    if (shouldShow) {
      actions.push({
        action,
        ...ActionButtons[action]
      })
    }
  })

  return actions
}

/**
 * 检查是否可以任命某角色
 * @param {string} currentRole - 当前用户角色
 * @param {string} targetRole - 目标角色
 * @returns {boolean}
 */
export function canAssignRole(currentRole, targetRole) {
  const currentLevel = AdminRoleLevel[currentRole] || 0
  const targetLevel = AdminRoleLevel[targetRole] || 0
  return currentLevel > targetLevel
}

/**
 * 检查是否为管理员
 * @param {string} role - 用户角色
 * @returns {boolean}
 */
export function isAdmin(role) {
  return AdminRoleLevel[role] > 0
}
