<template>
  <login-layout v-if="user.isEnterprise() ? user.themeInfo : true" v-loading="loading">
    <LoginContainer :subTitle="user.themeInfo?.slogan || $t('views.system.theme.defaultSlogan')">
      <h2 class="mb-24" v-if="!showQrCodeTab">{{ loginMode || $t('views.login.title') }}</h2>
      <div v-if="!showQrCodeTab">
        <el-form
            class="login-form"
            :rules="rules"
            :model="loginForm"
            ref="loginFormRef"
            @keyup.enter="login"
        >
          <div class="mb-24">
            <el-form-item prop="username">
              <el-input
                  size="large"
                  class="input-item"
                  v-model="loginForm.username"
                  :placeholder="$t('views.user.userForm.form.username.placeholder')"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="mb-24">
            <el-form-item prop="password">
              <el-input
                  type="password"
                  size="large"
                  class="input-item"
                  v-model="loginForm.password"
                  :placeholder="$t('views.user.userForm.form.password.placeholder')"
                  show-password
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>

        <el-button size="large" type="primary" class="w-full" @click="login">{{
            $t('views.login.buttons.login')
          }}
        </el-button>
        <div class="operate-container flex-between mt-12">
          <!-- <el-button class="register" @click="router.push('/register')" link type="primary">
          注册
        </el-button> -->
          <el-button
              class="forgot-password"
              @click="router.push('/forgot_password')"
              link
              type="primary"
          >
            {{ $t('views.login.forgotPassword') }}?
          </el-button>
        </div>
      </div>
      <div v-if="showQrCodeTab">
        <QrCodeTab :tabs="orgOptions"/>
      </div>

      <div class="login-gradient-divider lighter mt-24" v-if="modeList.length > 1">
        <span>{{ $t('views.login.moreMethod') }}</span>
      </div>
      <div class="text-center mt-16">
        <template v-for="item in modeList">
          <el-button
              v-if="item !== '' && loginMode !== item && item !== 'QR_CODE'"
              circle
              :key="item"
              class="login-button-circle color-secondary"
              @click="changeMode(item)"
          >
            <span
                :style="{
                'font-size': item === 'OAUTH2' ? '8px' : '10px',
                color: user.themeInfo?.theme
              }"
            >{{ item }}</span
            >
          </el-button>
          <el-button
              v-if="item === 'QR_CODE' && loginMode !== item"
              circle
              :key="item"
              class="login-button-circle color-secondary"
              @click="changeMode('QR_CODE')"
          >
            <img src="@/assets/icon_qr_outlined.svg" width="25px"/>
          </el-button>
          <el-button
              v-if="item === '' && loginMode !== ''"
              circle
              :key="item"
              class="login-button-circle color-secondary"
              style="font-size: 24px"
              icon="UserFilled"
              @click="changeMode('')"
          />
        </template>
      </div>
    </LoginContainer>
  </login-layout>
</template>
<script setup lang="ts">
import {onMounted, ref, onBeforeMount} from 'vue'
import type {LoginRequest} from '@/api/type/user'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import useStore from '@/stores'
import authApi from '@/api/auth-setting'
import {MsgConfirm, MsgSuccess} from '@/utils/message'
import {useRoute} from 'vue-router'
import {t, getBrowserLang} from '@/locales'
import QrCodeTab from '@/views/login/components/QrCodeTab.vue'
import {useI18n} from 'vue-i18n'

const {locale} = useI18n({useScope: 'global'})
const loading = ref<boolean>(false)
const {user} = useStore()
import {nextTick} from 'vue'
const route = useRoute();
import { ElMessage } from 'element-plus'
const router = useRouter()
const loginForm = ref<LoginRequest>({
  username: '',
  password: ''
})

const rules = ref<FormRules<LoginRequest>>({
  username: [
    {
      required: true,
      message: t('views.user.userForm.form.username.requiredMessage'),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('views.user.userForm.form.password.requiredMessage'),
      trigger: 'blur'
    }
  ]
})
const loginFormRef = ref<FormInstance>()

const modeList = ref<string[]>([''])
const QrList = ref<any[]>([''])
const loginMode = ref('')
const showQrCodeTab = ref(false)

interface qrOption {
  key: string
  value: string
}

const orgOptions = ref<qrOption[]>([])

function redirectAuth(authType: string) {
  if (authType === 'LDAP' || authType === '') {
    return
  }
  authApi.getAuthSetting(authType, loading).then((res: any) => {
    if (!res.data) {
      return
    }
    MsgConfirm(t('views.login.jump_tip'), '', {
      confirmButtonText: t('views.login.jump'),
      cancelButtonText: t('common.cancel'),
      confirmButtonClass: ''
    })
        .then(() => {
          if (!res.data.config_data) {
            return
          }
          const config = res.data.config_data
          const redirectUrl = eval(`\`${config.redirectUrl}\``)
          let url
          if (authType === 'CAS') {
            url = config.ldpUri
            if (url.indexOf('?') !== -1) {
              url = `${config.ldpUri}&service=${encodeURIComponent(redirectUrl)}`
            } else {
              url = `${config.ldpUri}?service=${encodeURIComponent(redirectUrl)}`
            }
          }
          if (authType === 'OIDC') {
            const scope = config.scope || 'openid+profile+email'
            url = `${config.authEndpoint}?client_id=${config.clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}`
          }
          if (authType === 'OAuth2') {
            url =
                `${config.authEndpoint}?client_id=${config.clientId}&response_type=code` +
                `&redirect_uri=${redirectUrl}&state=${res.data.id}`
            if (config.scope) {
              url += `&scope=${config.scope}`
            }
          }
          if (url) {
            window.location.href = url
          }
        })
        .catch(() => {
        })
  })
}

function changeMode(val: string) {
  loginMode.value = val === 'LDAP' ? val : ''
  if (val === 'QR_CODE') {
    loginMode.value = val
    showQrCodeTab.value = true
    return
  }
  showQrCodeTab.value = false
  loginForm.value = {
    username: '',
    password: ''
  }
  redirectAuth(val)
  loginFormRef.value?.clearValidate()
}

const login = () => {
  loginFormRef.value?.validate().then(() => {
    loading.value = true
    user
        .login(loginMode.value, loginForm.value.username, loginForm.value.password)
        .then(() => {
          locale.value = localStorage.getItem('LLM-Know-locale') || getBrowserLang() || 'en-US'
           // 修改为replace并清除查询参数
          router.replace({ name: 'home', query: {} })
        })
        .finally(() => (loading.value = false))
  })
}

onMounted(() => {

  const autoLogin = () => {
    const {username, password} = route.query
    if (username && password) {
      // 填充表单
      loginForm.value = {
        username: decodeURIComponent(username.toString()),
        password: decodeURIComponent(password.toString())
      }

      // 等待表单更新
      nextTick(() => {
        // 触发表单验证
        loginFormRef.value?.validate().then(() => {
          // 触发登录操作
          login()
          // 清除URL参数
          router.replace({path: route.path, query: {}})
        }).catch(() => {
          ElMessage.warning(t('views.login.autoLoginFailed'))
        })
      })
    }
  }

  // 先执行自动登录检查
  autoLogin()
  user.asyncGetProfile().then((res) => {
    if (user.isEnterprise()) {
      loading.value = true
      user
          .getAuthType()
          .then((res) => {
            //如果结果包含LDAP，把LDAP放在第一个
            const ldapIndex = res.indexOf('LDAP')
            if (ldapIndex !== -1) {
              const [ldap] = res.splice(ldapIndex, 1)
              res.unshift(ldap)
            }
            modeList.value = [...modeList.value, ...res]
          })
          .finally(() => (loading.value = false))
      user
          .getQrType()
          .then((res) => {
            if (res.length > 0) {
              modeList.value = ['QR_CODE', ...modeList.value]
              QrList.value = res
              QrList.value.forEach((item) => {
                orgOptions.value.push({
                  key: item,
                  value:
                      item === 'wecom'
                          ? t('views.system.authentication.scanTheQRCode.wecom')
                          : item === 'dingtalk'
                              ? t('views.system.authentication.scanTheQRCode.dingtalk')
                              : t('views.system.authentication.scanTheQRCode.lark')
                })
              })
            }
          })
          .finally(() => (loading.value = false))
    }
  })
})
</script>
<style lang="scss" scope>
.login-gradient-divider {
  position: relative;
  text-align: center;
  color: var(--el-color-info);

  ::before {
    content: '';
    width: 25%;
    height: 1px;
    background: linear-gradient(90deg, rgba(222, 224, 227, 0) 0%, #dee0e3 100%);
    position: absolute;
    left: 16px;
    top: 50%;
  }

  ::after {
    content: '';
    width: 25%;
    height: 1px;
    background: linear-gradient(90deg, #dee0e3 0%, rgba(222, 224, 227, 0) 100%);
    position: absolute;
    right: 16px;
    top: 50%;
  }
}

.login-button-circle {
  padding: 20px !important;
  margin: 0 4px;
  width: 32px;
  height: 32px;
  text-align: center;
}
</style>
